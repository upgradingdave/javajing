package com.upgradingdave.props;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class ConfigExample {

    String whereAmI;
    String whoAmi;

    static Logger log = LoggerFactory.getLogger(ConfigExample.class);

    public static void main(String[] args){

        log.debug("Starting ConfigExample Main");
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("/META-INF/spring/module-context.xml");
        ConfigExample configExample = (ConfigExample) context.getBean("configExample");

        System.out.println(configExample);

    }

    public ConfigExample(String whereAmI, String whoAmi) {

        this.whereAmI = whereAmI;
        this.whoAmi = whoAmi;

    }

    public String toString(){

        return String.format("ConfigExample[WhereAmI: %s %s]", whereAmI, whoAmi);

    }

    public String getWhereAmI() {

        return whereAmI;

    }

}
