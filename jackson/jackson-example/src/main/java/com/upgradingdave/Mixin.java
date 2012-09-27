package com.upgradingdave;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class Mixin {

    private static final Logger log = LoggerFactory.getLogger(Mixin.class);

    @JsonProperty
    String text;

}
