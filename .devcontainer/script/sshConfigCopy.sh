#!/bin/bash

echo -en "\033[1;33m→\033[0m "
echo -e "Copy ssh config from host mount"
\cp -R /root/.host/.ssh/ /root

if [ -n "$(grep 'UseKeychain' /root/.ssh/config &> /dev/null)" ]; then
	echo -en "\033[1;33m→\033[0m "
	echo -e "Remove UseKeychain in devcontainer ssh config"
	sed -i '/UseKeychain/d' /root/.ssh/config
fi
