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
* [buffer](https://nodejs.org/api/buffer.html)

## Table of contents

* [Localhost](#localhost)
	* [Container commands](#container-commands)
		* [Create/recreate containers](#createrecreate-containers)
		* [Start containers](#start-containers)
		* [Stop containers](#stop-containers)

	* [App commands](#app-commands)
		* [Install app dependencies](#install-app-dependencies)
		* [Start app in dev mode](#start-app-in-dev-mode)

	* [Server commands](#server-commands)
		* [Start server in dev mode](#start-server-in-dev-mode)

* [Selfhost](#selfhost)

## Localhost

Setting up this project is easiest done with `docker compose`, either directly from terminal or from within the provided `devcontainer`.

### Container commands

#### Create/recreate containers

```bash
docker compose up -d --force-recreate
```

#### Start containers

```bash
docker compose start
```

#### Stop containers

```bash
docker compose stop
```

### App commands

#### Install dependencies

```bash
docker compose exec app npm ci
```

#### Start app in dev mode

```bash
docker compose exec app npm start
```

### Server commands

#### Start server in dev mode

```bash
docker compose exec server npm start
```

## Selfhost

TODO...