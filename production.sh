#!/bin/bash

# This will switch to the production branch and automatically checkout the correct version of the grFirebase module

git checkout production
git submodule update --remote app/grFirebase
