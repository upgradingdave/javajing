#!/bin/bash
#
# Copy videos to backup drive

rsync -vac videos/* centurion:~/projects/javajing/videos/
