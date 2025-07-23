#!/bin/bash
# Simple script to update build number in a file (e.g., build.txt)
BUILD_FILE=build.txt
if [ ! -f "$BUILD_FILE" ]; then
  echo 1 > $BUILD_FILE
else
  BUILD_NUM=$(cat $BUILD_FILE)
  BUILD_NUM=$((BUILD_NUM + 1))
  echo $BUILD_NUM > $BUILD_FILE
fi

echo "Build number updated to: $(cat $BUILD_FILE)"
