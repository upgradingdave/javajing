package com.upgradingdave.encryption;

import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.EnvironmentPBEConfig;
import org.jasypt.properties.EncryptableProperties;
import org.jasypt.util.text.BasicTextEncryptor;
import org.junit.Test;

import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Properties;

import static org.junit.Assert.assertEquals;

public class JasyptTest {
	
    @Test
    public void simpleTest(){

        BasicTextEncryptor encryptor = new BasicTextEncryptor();
        encryptor.setPassword("secret");

        String message = "super secret message";
        String encrypted = encryptor.encrypt(message);
        System.out.println(encrypted);

        assertEquals(message, encryptor.decrypt(encrypted));

    }

    @Test
    public void propsTest() throws IOException {

        BasicTextEncryptor encryptor = new BasicTextEncryptor();
        encryptor.setPassword("secret");

        Properties props = new EncryptableProperties(encryptor);
        URL url = JasyptTest.class.getClassLoader().getResource("secret.conf");

        props.load(new FileInputStream(url.getFile()));

        String message = props.getProperty("encrypted");

        assertEquals("super secret message", message);

    }

    @Test
    public void passwordTest() throws IOException, InterruptedException {

        EnvironmentPBEConfig config = new EnvironmentPBEConfig();
        config.setAlgorithm("PBEWithMD5AndDES");
        config.setPasswordEnvName("MY_APP_PASSWORD");

        StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
        encryptor.setConfig(config);

        Properties props = new EncryptableProperties(encryptor);
        URL url = JasyptTest.class.getClassLoader().getResource("secret.conf");

        props.load(new FileInputStream(url.getFile()));
        String message;

        try {
            message = props.getProperty("encrypted");
        } catch (NullPointerException e) {
            throw new AssertionError("Set MY_APP_PASSWORD and try again");
        }

        assertEquals("super secret message", message);

    }


}
