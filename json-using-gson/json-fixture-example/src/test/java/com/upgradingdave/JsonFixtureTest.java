package com.upgradingdave;

import org.junit.Test;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.assertEquals;


public class JsonFixtureTest {
	
    @Test
    public void toJson(){

        DateFormat df = new SimpleDateFormat(JsonFixture.DATE_FORMAT);
        Date updated;
        try {
            updated = df.parse("2012-07-03 21:06:48");
        } catch (ParseException e) {
            throw new AssertionError("Unable to parse date");
        }
        Person person = new Person(updated, "Bill", "Cosby", "bcosby@gmail.com");
        JsonFixture<Person> personJsonFixture = new JsonFixture<>(Person.class);
        String json = personJsonFixture.toJson(person);

        assertEquals("{\"firstName\":\"Bill\",\"lastName\":\"Cosby\",\"email\":\"bcosby@gmail.com\",\"lastUpdated\":\"2012-07-03 21:06:48\"}", json);
    }

    @Test
    public void fromJson(){

        JsonFixture<Person> personJsonFixture = new JsonFixture<>(Person.class);
        List<Person> people = personJsonFixture.fromFile("fixtures/person.json");

        assertEquals(2, people.size());
        assertEquals("Steve", people.get(1).getFirstName());

    }

    class Person {

        String firstName;
        String lastName;
        String email;
        Date lastUpdated;

        Person(Date lastUpdated, String firstName, String lastName, String email) {
            this.lastUpdated = lastUpdated;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
        }

        public String getFirstName() {
            return firstName;
        }
    }
}
