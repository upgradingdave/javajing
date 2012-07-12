package com.upgradingdave.models;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class User {

    Logger log = LoggerFactory.getLogger(User.class);

    private integer id;
    private string firstName;
    private string lastName;
    private string email;

    public integer getId() {
        return id;
    }
     
    public void setId(integer id) {
        this.id = id;
    }

    public string getFirstName() {
        return firstName;
    }
     
    public void setFirstName(string firstName) {
        this.firstName = firstName;
    }

    public string getLastName() {
        return lastName;
    }
     
    public void setLastName(string lastName) {
        this.lastName = lastName;
    }

    public string getEmail() {
        return email;
    }
     
    public void setEmail(string email) {
        this.email = email;
    }
}
