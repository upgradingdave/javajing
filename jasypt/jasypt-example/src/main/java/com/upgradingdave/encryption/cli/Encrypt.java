package com.upgradingdave.encryption.cli;

import com.upgradingdave.encryption.JasyptExample;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Encrypt extends EncryptionCli{

    private static final Logger log = LoggerFactory.getLogger(Encrypt.class);

    public static void main(String[] args){

        Encrypt encrypt = new Encrypt(Encrypt.class.getSimpleName(), Encrypt.class.getSimpleName().toLowerCase());
        encrypt.parseArgs(args);

        JasyptExample j = new JasyptExample(encrypt.getPassword());
        System.out.println("Encrypted Message: ");
        System.out.println(j.encrypt(encrypt.getMessage()));

    }

    public Encrypt(String command, String operation) {
        super(command, operation);
    }
}
