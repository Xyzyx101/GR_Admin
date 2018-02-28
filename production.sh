#!/bin/bash

# This will switch to the production branch and automatically checkout the correct version of the grFirebase module

git checkout production
git submodule update --remote app/grFirebase

#switch to correct firebase target
if hash firebase 2>/dev/null; then
	firebase use production
else
	echo "Firebase cli not found.  Aborting firebase target switch"
fi
