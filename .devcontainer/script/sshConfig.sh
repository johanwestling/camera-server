#!/bin/bash

echo -en "\033[1;33m[ssh]]\033[0m "
echo -e "Copy config from host"
\cp -R /root/.host/.ssh/ /root

if [ -n "$(grep 'UseKeychain' /root/.ssh/config &> /dev/null)" ]; then
	echo -en "\033[1;33m[ssh]]\033[0m "
	echo -e "Disable UseKeychain in devcontainer"
	sed -i '/UseKeychain/d' /root/.ssh/config
fi

echo -e "\033[1;33m[ssh]\033[0m Enable identities\033[0m"
for pubkey in $(ls /root/.ssh/*.pub); do
	file=$(basename $pubkey '.pub')
	directory=$(dirname $pubkey)
	key="$directory/$file"

	if [ -f $key ]; then
		ssh-add $key
	fi
done