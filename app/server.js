import { createServer } from 'node:http';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { extname } from 'node:path';

const hostname = process?.env?.HOSTNAME;
const port = process?.env?.PORT;
const server = createServer(requestHandler);
const prefix = '\x1b[33m[server]\x1b[0m';

server.listen(port, hostname, () => {
  console.log(
    prefix,
    'Ready:\t', 
    `http://${hostname}:${port}/`
  );
});

async function requestHandler(request, response){
  try {
    // Handle preflight (CORS) requests.
    if(request?.method === 'OPTIONS'){
      await responseHeadersCors(response);
      response.writeHead(204);
      response.end();
      return;
    }

    // Handle requests.
    switch (request?.url) {
      // Stream requests.
      case '/stream/chunk': await streamChunk(request, response); break;
      case '/stream/end': await streamEnd(request, response); break;
      // Static requests.
      default: await staticFile(request, response); break;
    }
  } catch (thrown) {
    // Handle errors.
    const status = thrown?.cause?.status || 500;
    const message = thrown?.message || 'Internal Server Error';
    
    console.warn(thrown);

    response.writeHead(status);
    response.end(message);
  }
}

async function responseHeadersCors(response){
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Stream-Id, Stream-Chunk');
}

async function staticFile(request, response){
  const url = decodeURIComponent(request?.url);
  const file = `./static${url === '/' ? '/index.html': url}`;
  const allowed = [
    './static/index.html',
    './static/favicon.ico',
    './static/site.webmanifest',
    './static/assets/',
    './streams/'
  ].find((path) => {
    return file.startsWith(path);
  });

  if(!allowed){
    throw new Error('Forbidden', {
      cause: {
        status: 403,
        file,
      }
    });
  }

  const extension = extname(file)?.toLowerCase();
  const mimes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png' : 'image/png',
    '.jpg' : 'image/jpeg',
    '.svg' : 'image/svg+xml',
    '.json': 'application/json',
  };
  const mime = mimes?.[extension] || 'application/octet-stream';

  await new Promise((resolve, reject) => {
    const stream = createReadStream(file);

    stream.on('open', () => {
      response.writeHead(200, { 
        'Content-Type': mime 
      });
      stream.pipe(response);
    });
    stream.on('end', resolve);
    stream.on('error', (error) => {
      reject(
        new Error('Not found', {
          cause: {
            status: 404,
            file,
            error,
          }
        })
      );
    });
  });

  console.log(
    prefix,
    'Serve:\t',
    JSON.stringify({
      file,
      mime
    })
  );
}

async function streamChunk(request, response){
  const payload = await streamChunkPayload(request);
  const save = await streamChunkSave(request, payload);
  const body = {
    event: 'chunk',
    id: save?.id,
    chunk: save?.chunk,
    type: payload?.type,
  };

  console.log(
    prefix,
    'Stream:',
    JSON.stringify(body)
  );

  await responseHeadersCors(response);

  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(body));
}

async function streamEnd(request, response){
  const merge = await streamChunkMerge(request);
  const body = {
    event: 'ended',
    id: merge?.id,
    chunks: merge?.chunks,
    video: merge?.video?.replace(/^\./, ''),
  };
  
  console.log(
    prefix, 
    'Stream:',
    JSON.stringify(body)
  );
  
  await responseHeadersCors(response);
  
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(body));
}

function streamChunkPayload(request, body = '') {
  return new Promise((resolve) => {
    request.setEncoding('utf8');
    request.on('data', chunk => body += chunk);
    request.on('end', () => {
      const json = JSON.parse(body);
      const match = json?.data.match(/^data:(.*);base64,(.+)$/);
      const type = match?.[1];
      const data = match?.[2];
      const buffer = Buffer.from(data, 'base64');

      resolve({
        type,
        buffer
      });
    });
  });
}

async function streamChunkSave(request, payload) {
  const id = request?.headers?.['stream-id'];
  const chunk = request?.headers?.['stream-chunk'];
  const directory = `./streams/${id}`;
  const name = `chunk-${String(chunk).padStart(6,'0')}.webm`;
  const file = `${directory}/${name}`;

  await mkdir(directory, { 
    recursive: true 
  });
  
  await writeFile(file, payload.buffer);

  return {
    id,
    chunk,
    file
  };
}

async function streamChunkMerge(request){
  const id = request?.headers?.['stream-id'];
  const directory = `./streams/${id}`;
  const files = await readdir(directory);
  const chunks = files
    .filter(file => file.startsWith('chunk-'))
    .map(file => `${directory}/${file}`);
  const video = `${directory}/video.webm`;
  const target = createWriteStream(video);
  
  for(const chunk of chunks){
    const source = createReadStream(chunk);
    
    await new Promise((resolve, reject) => {
      source.pipe(target, { 
        end: false 
      });
      source.on('end', resolve);
      source.on('error', reject);
    });
  }

  target.end();

  return {
    id,
    chunks: chunks.length,
    video,
  }
}
