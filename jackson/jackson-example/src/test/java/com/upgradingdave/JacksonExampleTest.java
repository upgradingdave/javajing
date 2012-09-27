package com.upgradingdave;

import org.junit.Test;

import static junit.framework.Assert.assertEquals;


public class JacksonExampleTest {
	
    @Test
    public void toJson(){

    }

    @Test
    public void fromJson(){

        JacksonExample<Forecast> jacksonExample = new JacksonExample<Forecast>(Forecast.class);
        String expected = "{\"code\":34,\"date\":\"19 Sep 2012\",\"day\":\"Wed\",\"high\":71,\"low\":49,\"text\":\"Mostly Sunny\"}";
        Forecast result = jacksonExample.fromJson(expected);

        assertEquals(34, result.getCode());

        String json = jacksonExample.toJson(result);

        assertEquals(expected, json);


    }

}
