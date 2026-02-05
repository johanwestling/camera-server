FROM ubuntu:22.04

RUN echo "Install system packages" \
	&& export DEBIAN_FRONTEND=noninteractive \
	&& apt update \
	&& apt install -y --no-install-recommends \
		ca-certificates \
		curl \
		wget \
		git \
		unzip \
		gnupg \
		lsb-release \
		build-essential \
		openssl \
		openssh-client \
		bash \
		bash-completion \
		nano \
		jq \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

RUN echo "Install starship" \
	&& curl -sS https://starship.rs/install.sh | sh -s -- --yes \
	&& echo 'eval "$(starship init bash)"' >> /root/.bashrc

RUN echo "Install docker" \
	&& install -m 0755 -d /etc/apt/keyrings \
	&& curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
	&& chmod a+r /etc/apt/keyrings/docker.gpg \
	&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
	&& export DEBIAN_FRONTEND=noninteractive \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends \
		docker-ce \
		docker-ce-cli \
		containerd.io \
		docker-buildx-plugin \
		docker-compose-plugin \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*
