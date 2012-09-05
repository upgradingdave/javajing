package com.upgradingdave.encryption.cli;

import com.upgradingdave.encryption.JasyptExample;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Decrypt extends EncryptionCli{

    private static final Logger log = LoggerFactory.getLogger(Decrypt.class);

    public static void main(String[] args){

        Decrypt decrypt = new Decrypt(Decrypt.class.getSimpleName(), Decrypt.class.getSimpleName().toLowerCase());
        decrypt.parseArgs(args);

        JasyptExample j = new JasyptExample(decrypt.getPassword());
        System.out.println("Decrypted Message: ");
        System.out.println(j.decrypt(decrypt.getMessage()));

    }

    public Decrypt(String command, String operation) {
        super(command, operation);
    }
}
