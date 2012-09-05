package com.upgradingdave.encryption.cli;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public abstract class EncryptionCli {

    final static protected Logger log = LoggerFactory.getLogger(EncryptionCli.class);
    final static private String DEFAULT_PASSWORD = "password";

    String command;
    String operation;

    String password = DEFAULT_PASSWORD;
    String message = null;

    protected EncryptionCli(String command, String operation) {
        this.command = command;
        this.operation = operation;
    }

    public void usage(){
        System.out.println("Usage: "+command+" [-h] [<password>] <message>");
        System.out.println("        -h print this help message");
        System.out.println("        (optional) password used to "+operation+" messages, defaults to 'password'");
        System.out.println("        message to "+operation);
    }

    public void parseArgs(String[] args) {

        if(args.length > 0 && args[0].equals("-h")) {
            usage();
            return;
        }

        if(args.length == 2) {

            password = args[0];
            message = args[1];

        } else if(args.length == 1) {

            System.out.println("Note: Using default password");
            message = args[0];

        } else if(args.length <= 0) {

            try {

                password = readInput("Password to use to "+operation+": ");

                if(password == null || password.isEmpty()){
                    System.out.println("Note: Using default password");
                    password = DEFAULT_PASSWORD;
                }
                message = readInput("Message to "+operation+": ");

            } catch (IOException e) {
                log.error("Problem reading input", e);
            }

        }

        if(message == null || message.isEmpty() || password == null || password.isEmpty() || args.length > 2) {

            System.out.println("Oops not sure what you want to do, please see the usage below.");
            usage();

        }
    }

    public String readInput(String prompt) throws IOException {

        BufferedReader reader;

        reader = new BufferedReader(new InputStreamReader(System.in));

        System.out.print(prompt);

        return reader.readLine();

    }

    public String getPassword() {
        return password;
    }

    public String getMessage() {
        return message;
    }
}
