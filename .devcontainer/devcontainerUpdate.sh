#!/bin/bash

echo -en "\033[1;33m→\033[0m "
echo -e "Update .devcontainer"

pwdBefore=".devcontainer"
pwdAfter=$(pwd)

cd $pwdBefore \
	&& git pull \
	&& cd $pwdAfter