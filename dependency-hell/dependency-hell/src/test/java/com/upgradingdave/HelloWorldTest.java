package com.upgradingdave;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.assertEquals;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:/META-INF/spring/module-context.xml"})
public class HelloWorldTest {

    @Test
    public void testHelloWorld(){

        HelloWorld helloWorld = new HelloWorld();
        assertEquals("Hello, World", helloWorld.helloWorld());

    }
	
}
