try {
	const server = import.meta.env.SERVER;
	const camera = await navigator.mediaDevices.getUserMedia({
		video: true,
		audio: false,
	});
	const streamId = await cookieStore.get('streamid');
	const stream = {
		id: streamId?.value,
		recorder: new MediaRecorder(camera, {
			mimeType: 'video/webm; codecs=vp8,opus',
		}),
		preview: document.querySelector('video'),
		chunk: 0,
		interval: 1000,
	};
	const toggle = document.querySelector('input');
	
	stream.preview.srcObject = camera;
	stream.preview.onloadedmetadata = previewData;
	stream.recorder.ondataavailable = streamChunk;
	stream.recorder.onstop = streamEnd;
	
	toggle.addEventListener('change', toggleChange);

	function toggleChange(event){
		if(event?.target?.checked){
			stream.recorder.start(stream.interval);
			return;
		}
		
		stream.recorder.stop();
	}

	function previewData(event){
		stream.preview.play();
	}

	async function streamIdGenerate(){
		const uuid = crypto.randomUUID();

		await cookieStore.set('streamid', uuid);
		
		stream.id = uuid;
		stream.chunk = 0;
	}

	async function streamChunk(event){
		const data = await new Promise((resolve) => {
			if(!event?.data?.size){
				resolve();
			}

			const reader = new FileReader();
	
			reader.addEventListener('loadend', () => {
				resolve(reader.result);
			});
			reader.readAsDataURL(event?.data);
		});

		if(!data){
			return;
		}

		if(!stream?.id){
			await streamIdGenerate();
		}

		const headers = new Headers();

		headers.set('Content-Type', 'application/json');
		headers.set('Stream-Id', stream.id);
		headers.set('Stream-Chunk', stream.chunk);

		const body = JSON.stringify({
			data
		});

		const request = await fetch(`${server}/stream/chunk`, {
			method: 'POST',
			headers,
			body
		});
		const response = await request.json();

		console.log(
			'[stream]',
			'Sent chunk of',
			`id: ${response?.id},`,
			`chunk: ${response?.chunk},`,
			`type: ${response?.type};`
		);

		stream.chunk += 1;
	}

	function streamEnd(){
		setTimeout(async() => {	
			const headers = new Headers();

			headers.set('Stream-Id', stream.id);
	
			const request = await fetch(`${server}/stream/end`, {
				method: 'POST',
				headers
			});
			const response = await request.json();
	
			console.log(
				'[stream]',
				'Send end of',
				`id: ${response?.id},`,
				`chunks: ${response?.chunks},`,
				`video: ${response?.video};`
			);
	
			await streamIdGenerate();
		}, stream.interval);
	}
} catch (thrown) {
	switch (true) {
		case thrown?.name === 'NotAllowedError': {
			alert('Camera access is required');
			break;
		}

		default: {
			console.warn(thrown);
			break;
		}
	}
}
