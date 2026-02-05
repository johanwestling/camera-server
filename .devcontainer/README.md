# Devcontainer

A template for getting started with [devcontainers](https://containers.dev/) in new or existing repositories.

**Table of contents**

* [Create repository](#create-repository)
* [Add to existing project](#add-to-existing-project)
* [Update template](#update-template)
* [Remove template](#remove-template)
* [Alias launch in devcontainer](#alias-launch-in-devcontainer)

<br>

### Create repository

* https://github.com/new?template_name=.devcontainer&template_owner=johanwestling

<br>

### Add to existing project

1. Open terminal.

1. Change to project directory:

	```bash
	cd /path/to/project
	```

1. Add `.devcontainer` to project:

	```bash
	curl -sS https://raw.githubusercontent.com/johanwestling/.devcontainer/refs/heads/main/devcontainerInstall.sh | bash
	```

1. Open vscode or other editor supporting devcontainers:

	```bash
	code .
	```

1. When prompted click **Reopen in container**.

<br>

### Update template

1. Open terminal.

1. Change to project directory:

	```bash
	cd /path/to/project
	```

1. Update template:

	```bash
	.devcontainer/devcontainerUpdate.sh
	```

<br>

### Remove template

1. Open terminal.

1. Change to project directory:

	```bash
	cd /path/to/project
	```

1. Remove template:

	```bash
	.devcontainer/devcontainerRemove.sh
	```

<br>

### Alias launch in devcontainer

If you want vscode launch your project directly in your newly created devcontainer, check my gist:

* https://gist.github.com/johanwestling/6db820d0c662045a4b3230bdbba27216