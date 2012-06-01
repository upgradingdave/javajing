package com.upgradingdave.example;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static junit.framework.Assert.assertEquals;

@RunWith(value = SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:META-INF/simplebean-context.xml"})
public class SimpleBeanDaoTest {

    @Autowired
    SimpleDao simpleDao;
	
    @Test
    public void findSimpleBean(){

        SimpleBeanDb simpleBeanDb = new SimpleBeanDb("dave", "secret");
        SimpleDao simpleDao = new SimpleDaoImpl(simpleBeanDb);
        assertEquals("Super Simple Bean", simpleDao.find((long) 12345).getName());

    }

    @Test
    public void findSimpleBeanWithSpring(){

        assertEquals("Super Simple Bean", simpleDao.find((long) 12345).getName());

    }
	
}
