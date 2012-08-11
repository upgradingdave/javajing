#!/bin/bash

FILE_PREFIX=$(echo $1 | grep -oE "episode.+-poster")

cp $1 tmp.png
sips -z 131 175 tmp.png
mv tmp.png "$FILE_PREFIX-175x131.png"

cp $1 tmp.png
sips -z 487 650 tmp.png
mv tmp.png "$FILE_PREFIX-650x487.png"
