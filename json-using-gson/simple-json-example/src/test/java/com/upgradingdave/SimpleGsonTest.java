package com.upgradingdave;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.junit.Test;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import static junit.framework.Assert.assertEquals;


public class SimpleGsonTest {
	
    @Test
    public void testGson(){

        Gson gson = new Gson();

        Person roger = new Person("Roger", "Federer", "roger@gmail.com");

        String json = gson.toJson(roger, Person.class);

        assertEquals("{\"firstName\":\"Roger\",\"lastName\":\"Federer\",\"email\":\"roger@gmail.com\"}", json);

        Person result = gson.fromJson(json, Person.class);

        assertEquals(result.getEmail(), roger.getEmail());


    }

    @Test
    public void testFixture() {

        JsonFixture<Person> personJsonFixture = new JsonFixture<Person>(Person.class);
        List<Person> people = personJsonFixture.fromFile("fixtures/persons.json");
        assertEquals("roger@gmail.com", people.get(0).getEmail());
        assertEquals(2, people.size());

    }

    @Test
    public void date() throws ParseException {

        String dateFormat = "yyyy-MM-dd HH:mm:ss";

        GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.setDateFormat(dateFormat);

        Gson gson = gsonBuilder.create();

        String jsonDate = "2012-07-04 10:04:01";

        Date startDate = new SimpleDateFormat(dateFormat).parse(jsonDate);

        //valid json values are surrounded in double quotes
        String expected = "\""+jsonDate+"\"";

        assertEquals(expected, gson.toJson(startDate, Date.class));

        Date endDate = gson.fromJson(expected, Date.class);

        assertEquals(startDate, endDate);
    }

}

