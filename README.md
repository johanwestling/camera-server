# Camera Server

Records the devices camera stream and sends it to a node server for storage off-device.

**App uses:**
* [MediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
* [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
* [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
* [Crypto](https://developer.mozilla.org/en-US/docs/Web/API/Crypto)
* [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

**Server uses:**
* [http](https://nodejs.org/api/http.html)
* [fs](https://nodejs.org/api/fs.html)
* [path](https://nodejs.org/api/path.html)
* [buffer](https://nodejs.org/api/buffer.html)

## Table of contents

* [Localhost](#localhost)
	* [Installation](#installation)
	* [Commands](#commands)
		* [Start app service](#start-app-service)
		* [Stop app service](#stop-app-service)
		* [Start app server in dev mode](#start-app-server-in-dev-mode)
		* [Start app server in prod mode](#start-app-server-in-prod-mode)

* [Selfhost](#selfhost)

## Localhost

Setting up this project in your machine is easiest done with `docker compose`, which requires Docker Engine (with compose) or Docker Desktop to be installed.

> [!TIP]
> Use the included `devcontainer` by opening this repository in Visual Studio Code and click the _"Reopen in container"_ when prompted.

### Installation

```bash
docker compose up -d --force-recreate
```

### Commands

#### Start app service

```bash
docker compose start
```

#### Stop app service

```bash
docker compose stop
```

#### Start app server in dev mode

```bash
docker compose exec app npm start
```

#### Start app server in prod mode

```bash
docker compose exec app npm run server
```

## Selfhost

Deploy the files from `app` directory to any server that have `node` of a recent version.

Then have the server run `npm run server` or any other way to run the command found in `app/package.json` under `scripts.server` property.

Potentially there might be a need to change permissions on some directories depending on your server configuration.

```bash
sudo chmod -R 775 ./streams
```