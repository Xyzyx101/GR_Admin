#!/bin/bash

# This will switch to the test branch and automatically checkout the correct version of the grFirebase module

git checkout master
git submodule update --remote app/grFirebase
