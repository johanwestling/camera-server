#!/bin/bash

echo -en "\033[1;33m→\033[0m "
echo -e "Set git default editor"
git config --global core.editor "nano"

echo -en "\033[1;33m→\033[0m "
echo -e "Set git safe directories"
git config --global --add safe.directory ${DEVCONTAINER_WORKSPACE}
git config --global --add safe.directory ${DEVCONTAINER_WORKSPACE}/.devcontainer