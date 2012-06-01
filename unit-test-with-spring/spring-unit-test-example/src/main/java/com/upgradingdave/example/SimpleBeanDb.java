package com.upgradingdave.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

public class SimpleBeanDb {

    private static final Logger log = LoggerFactory.getLogger(SimpleBeanDb.class);

    private String username;
    private String password;

    Map<Long, SimpleBean> simpleBeans;

    public SimpleBeanDb(String username, String password) {

        log.info("Creating SimpleBeanDb");

        this.username = username;
        this.password = password;

        simpleBeans = new HashMap<Long, SimpleBean>();
        addSimpleBeanToDB((long) 12345, "Super Simple Bean");
        addSimpleBeanToDB((long) 23456, "Really Simple Bean");
        addSimpleBeanToDB((long) 34567, "Extra Simple Bean");

    }

    public void connect() {

        //Pretend this establishes some sort of connection to a Database

    }

    public SimpleBean getSimpleBean(Long id){

        return simpleBeans.get(id);

    }

    private void addSimpleBeanToDB(Long id, String name){

        simpleBeans.put(id, new SimpleBean(id, name));

    }

}
