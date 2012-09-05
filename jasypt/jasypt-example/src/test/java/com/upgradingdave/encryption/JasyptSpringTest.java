package com.upgradingdave.encryption;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.assertEquals;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:/META-INF/spring/test-context.xml"})
public class JasyptSpringTest {

    @Autowired
    SecretBean secretBean;

    @Test
    public void encryptPropsInSpring(){

        assertEquals("You can read this", secretBean.getMessage());
        assertEquals("You can't see this because it's encrypted!", secretBean.getEncrypted());

    }

}

