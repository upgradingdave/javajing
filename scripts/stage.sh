#!/bin/bash

WEBAPPDIR="site/src/main/webapp"
POSTSDIR="$WEBAPPDIR/org/_posts"

rm -rf "$POSTS_DIR/*"
cp "ruby-from-java/show-notes.org" "$POSTSDIR/2012-06-01-ruby-from-java.org"
cp "slf4j/show-notes.org" "$POSTSDIR/2012-06-08-slf4j.org"
cp "maven-repos/show-notes.org" "$POSTSDIR/2012-06-15-maven-repo.org"
cp "artifactory/show-notes.org" "$POSTSDIR/2012-06-22-artifactory.org"
cp "unit-test-with-spring/show-notes.org" "$POSTSDIR/2012-06-29-unit-test-with-spring.org"
cp "apache-proxy/show-notes.org" "$POSTSDIR/2012-07-06-apache-proxy.org"

