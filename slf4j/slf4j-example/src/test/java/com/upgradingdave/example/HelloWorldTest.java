package com.upgradingdave.example;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;


public class HelloWorldTest {
	
	private String first;
	
	@Before
	public void setUp(){
		first = "success";
	}
	
	@After
	public void tearDown(){
		first = null;
	}
	
	@Test
	public void testSetup(){
		assertEquals("success", first);
	}

    @Test
    public void testHelloWorld(){
        HelloWorld helloWorld = new HelloWorld();
        assertEquals("Hello, World", helloWorld.helloWorld());
    }
	
}
