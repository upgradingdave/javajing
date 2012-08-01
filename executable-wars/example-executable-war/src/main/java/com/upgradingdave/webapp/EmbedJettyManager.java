package com.upgradingdave.webapp;

import org.mortbay.jetty.Server;
import org.mortbay.jetty.webapp.WebAppContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.net.URL;

public class EmbedJettyManager {

    final static Logger log = LoggerFactory.getLogger(EmbedJettyManager.class);

    private int port;
    private String contextPath;

    public EmbedJettyManager(int port, String contextPath) {

        this.port = port;
        this.contextPath = contextPath;

    }

    public void runWebapp() throws IOException {

        File webappDir = this.findContainingFileName();

        log.debug("Attempting to start webapp located at {} at context path {} and port {}",
                new Object[]{webappDir, contextPath, port});

        final Server server = new Server(port);

        WebAppContext context = new WebAppContext(webappDir.getAbsolutePath(), contextPath);

        server.setHandler(context);

        try {

            server.start();

            //Wait for input
            System.out.println("Started jetty server listening on port "+port+". Press any key to stop server.");
            System.in.read();

            server.stop();
            server.join();

        } catch (Exception e) {
            log.error("Unable to start embedded jetty server", e);
        }

    }

    public URL findClasspathUrl(){

        return EmbedJettyManager.class.getProtectionDomain().getCodeSource().getLocation();

    }

    /**
     * When running exploded, this will return path to a directory like 'target/classes'.
     * If running from jar, this will return the path to the jar/war
     * @return path to wherever the class files exist
     * @throws IOException
     */
    public File findContainingFileName() throws IOException {

        URL url = findClasspathUrl();
        return new File(url.getFile());

    }

}
