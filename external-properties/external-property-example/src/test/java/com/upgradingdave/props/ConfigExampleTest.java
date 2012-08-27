package com.upgradingdave.props;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"/META-INF/spring/module-context.xml"})
public class ConfigExampleTest {

    @Autowired
    ConfigExample configExample;

    @Test
    public void testHelloWorld(){

        assertNotNull(configExample);

        assertEquals("hardcoded", configExample.getWhereAmI());

    }
	
}
