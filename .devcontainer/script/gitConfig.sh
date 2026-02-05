#!/bin/bash

echo -en "\033[1;33m[git]\033[0m "
echo -e "Copy config from host"
\cp /root/.host/.gitconfig $HOME/.gitconfig

echo -en "\033[1;33m[git]\033[0m "
echo -e "Set default editor"
git config --global core.editor "nano"

echo -en "\033[1;33m[git]\033[0m "
echo -e "Set safe directories"
git config --global --add safe.directory ${DEVCONTAINER_WORKSPACE}
git config --global --add safe.directory ${DEVCONTAINER_WORKSPACE}/.devcontainer