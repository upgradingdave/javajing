package com.upgradingdave.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HelloWorld {

    Logger log = LoggerFactory.getLogger(HelloWorld.class);
	
	public String helloWorld() {
        log.info("About to return Hello, World");
		return "Hello, World";
	}

}
