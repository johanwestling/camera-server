#!/bin/bash

echo -en "\033[1;33m→\033[0m "
echo -e "Install .devcontainer in $(pwd)"

git clone git@github.com:johanwestling/.devcontainer.git
