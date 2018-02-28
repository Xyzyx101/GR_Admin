#!/bin/bash

# This will switch to the test branch and automatically checkout the correct version of the grFirebase module

git checkout master
git submodule update --remote app/grFirebase

#switch to correct firebase target
if hash firebase 2>/dev/null; then
	firebase use test
else
	echo "Firebase cli not found.  Aborting firebase target switch"
fi
