#!/bin/bash

WEBAPPDIR="/Users/dparoulek/projects/javajing/site/src/main/webapp"
SITEDIR="$WEBAPPDIR/jekyll/_site"

scp -P31000 -r $SITEDIR/* dparoulek@mercury:~/apps/javajing/prod


