#!/bin/bash

bashCompletion(){
	local line=$(grep -nE '\s*\.\s\/etc/bash_completion' $HOME/.bashrc | cut -d: -f1)
	local disabled=$(sed -n "${line}p" $HOME/.bashrc | grep -e '^#')

	echo -en "\033[1;33m→\033[0m "

	if [ -n "$line" ] && [ -n "$disabled" ]; then
		echo -e "Enable bash completion"
		sed -i "$(($line-1))s/^# if/if/" $HOME/.bashrc
		sed -i "$(($line))s/^# //" $HOME/.bashrc
		sed -i "$(($line-1))s/^# fi/fi/" $HOME/.bashrc
	elif [ -z "$line" ]; then
		echo -e "Enable bash completion"
		echo "if [ -f /etc/bash_completion ] && ! shopt -oq posix; then" >> $HOME/.bashrc
		echo "   . /etc/bash_completion" >> $HOME/.bashrc
		echo "fi" >> $HOME/.bashrc
	else
		echo -e "\033[90mEnable bash completion (skipped: already enabled)\033[0m"
	fi
}

bashCompletion
