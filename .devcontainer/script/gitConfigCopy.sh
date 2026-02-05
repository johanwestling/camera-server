#!/bin/bash

echo -en "\033[1;33m→\033[0m "
echo -e "Copy git config from host mount"
\cp /root/.host/.gitconfig $HOME/.gitconfig