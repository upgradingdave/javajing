package com.upgradingdave.encryption;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SecretBean {

    private static final Logger log = LoggerFactory.getLogger(SecretBean.class);

    String message;
    String encrypted;

    public SecretBean(String message, String encrypted) {
        this.message = message;
        this.encrypted = encrypted;
    }

    public String getEncrypted() {
        return encrypted;
    }

    public String getMessage() {
        return message;
    }

}
