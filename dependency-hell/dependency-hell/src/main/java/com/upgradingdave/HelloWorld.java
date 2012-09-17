package com.upgradingdave;

import java.util.logging.Logger;

public class HelloWorld {

    Logger log = Logger.getLogger(HelloWorld.class.toString());
	
	public String helloWorld() {
        log.info("About to return Hello, World");
		return "Hello, World";
	}

}
