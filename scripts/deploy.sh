#!/bin/bash

WEBAPPDIR="/Users/dparoulek/projects/javajing/site/src/main/webapp"
SITEDIR="$WEBAPPDIR/jekyll/_site"
PORTNUMBER=31000

rsync -avz -e "ssh -p $PORTNUMBER" $SITEDIR/* dparoulek@mercury:~/apps/javajing/prod
#rsync -vac $SITEDIR/* dparoulek@mercury:~/apps/javajing/prod
#scp -P31000 -r $SITEDIR/* 


