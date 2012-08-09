#!/bin/bash
# This script makes use of upgradingdave-archetypes project to
# generate models, and data access objects for persisting objects to
# the database. These archetypes are conceptually similar to Rails
# Generators. 

PROJECT_NAME_PREFIX=generics-example
PACKAGE_PREFIX=example.generics
GROUP_ID=com.upgradingdave

# Generate Episode Model
archetypes.sh model-archetype -DartifactId=$PROJECT_NAME_PREFIX-models -DgroupId=$GROUP_ID -Dversion=1.0-SNAPSHOT -Dpackage=$PACKAGE_PREFIX.models -DmodelName=Episode -Dfields=title:String,summary:String,episodeNum:Integer -DprojectNamePrefix=$PROJECT_NAME_PREFIX -DprojectPackagePrefix=$PACKAGE_PREFIX

# Generate Persistence API
archetypes.sh persist-api-archetype -DartifactId=$PROJECT_NAME_PREFIX-persist-api -DgroupId=$GROUP_ID -Dversion=1.0-SNAPSHOT -Dpackage=$PACKAGE_PREFIX.persist.api -DmodelName=Episode -DprojectNamePrefix=$PROJECT_NAME_PREFIX -DprojectPackagePrefix=$PACKAGE_PREFIX

# Generate Persistence HSQLDB Implementation
archetypes.sh persist-hsqldb-archetype -DartifactId=$PROJECT_NAME_PREFIX-persist-hsqldb -DgroupId=$GROUP_ID -Dversion=1.0-SNAPSHOT -Dpackage=$PACKAGE_PREFIX.persist.hsqldb -DmodelName=Episode -Dfields=title:String,summary:String,episodeNum:Integer -DprojectNamePrefix=$PROJECT_NAME_PREFIX -DprojectPackagePrefix=$PACKAGE_PREFIX

