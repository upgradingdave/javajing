package com.upgradingdave.jaxp.dom;

import com.upgradingdave.jaxp.XmlHelper;
import org.junit.Test;

import java.io.File;
import java.util.List;

import static org.junit.Assert.*;

public class XmlHelperTest {
	
	@Test
    public void findValues(){

        File xmlFile = new File(XmlHelperTest.class.getClassLoader().getResource("xml/fredericksburg-weather.xml").getFile());
        assertNotNull(xmlFile);

        XmlHelper xmlHelper = new DomXmlHelper(xmlFile);
        List<String> values = xmlHelper.findValues("title");

        assertTrue(values.size() > 0);
        assertEquals("Yahoo! Weather - Fredericksburg, VA", values.get(0));

    }
	
}
