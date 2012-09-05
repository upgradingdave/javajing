package com.upgradingdave.encryption;

import org.jasypt.properties.EncryptableProperties;
import org.jasypt.util.text.BasicTextEncryptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.util.Properties;

public class JasyptExample {

    static final Logger log = LoggerFactory.getLogger(JasyptExample.class);
    //static final String nl = System.getProperty("line.separator");

    private BasicTextEncryptor encryptor;

    public JasyptExample(String password) {

        encryptor = new BasicTextEncryptor();
        encryptor.setPassword(password);
    }

    public String encrypt(String message) {

        return encryptor.encrypt(message);
    }

    public String decrypt(String message) {

        return encryptor.decrypt(message);

    }

    /**
     * Find all conf files on classpath. Use a EncryptableProperties so that any ENC(...) properties are decrypted
     */
    public Properties getProperties(){

        EncryptableProperties properties = new EncryptableProperties(encryptor);

        URL baseUrl = JasyptExample.class.getClassLoader().getResource(".");
        File rootClassPath = new File(baseUrl.getFile());
        for( String next : rootClassPath.list() ) {
            if(next.endsWith(".conf")) {
                try {
                    properties.load(new FileReader(baseUrl.getFile() + next));
                } catch (IOException e) {
                    log.error("Unable to read properties file {}", baseUrl.getFile() + next);
                }
            }
        }

        return properties;
    }

}
