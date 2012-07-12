package com.upgradingdave;

import com.google.gson.Gson;
import org.junit.Test;

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

}

