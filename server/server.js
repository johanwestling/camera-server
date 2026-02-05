import { createServer } from 'node:http';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

const hostname = process?.env?.HOSTNAME;
const port = process?.env?.PORT;
const server = createServer(requestHandler);

server.listen(port, hostname, () => {
  console.log(
    '[server]', 
    'Listerning at', 
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

    // Handle server routes.
    switch (request?.url) {
      case '/stream/chunk': await streamChunk(request, response); break;
      case '/stream/end': await streamEnd(request, response); break;
      
      default:{
        throw new Error('Not found', {
          cause: {
            status: 404,
            url: request?.url,
          }
        });
      }
    }
  } catch (thrown) {
    // Handle errors.
    console.warn(thrown);
    response.writeHead(thrown?.cause || 500);
    response.end(thrown?.toString?.() || 'Internal Server Error');
  }
}

async function responseHeadersCors(response){
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Stream-Id, Stream-Chunk');
}

async function streamChunk(request, response){
  const payload = await streamChunkPayload(request);
  const save = await streamChunkSave(request, payload);
  const body = {
    id: save?.id,
    chunk: save?.chunk,
    type: payload?.type,
  };

  console.log(
    '[stream]',
    'Received chunk of',
    `id: ${body.id},`, 
    `chunk: ${body.chunk},`, 
    `type: ${body.type};`
  );

  await responseHeadersCors(response);

  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(body));
}

async function streamEnd(request, response){
  const merge = await streamChunkMerge(request);
  const body = {
    id: merge?.id,
    chunks: merge?.chunks,
    video: merge?.video,
  };
  
  console.log(
    '[stream]', 
    'Received end of',
    `id: ${body.id},`, 
    `chunks: ${body.chunks},`, 
    `video: ${body.video};`
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
