package com.upgradingdave.webapp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public class Main {

    final static Logger log = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) {

        EmbedJettyManager embedJettyManager = new EmbedJettyManager(8080, "/");
        try {
            embedJettyManager.runWebapp();
        } catch (IOException e) {
            log.error("Unable to start Jetty server", e);
        }

    }

}
