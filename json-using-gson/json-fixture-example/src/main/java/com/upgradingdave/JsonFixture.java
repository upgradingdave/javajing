package com.upgradingdave;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.stream.JsonReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

public class JsonFixture<T> {

    Logger log = LoggerFactory.getLogger(JsonFixture.class);

    public final static String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

    Class clazz;
    Gson gson;

    public JsonFixture(Class clazz){

        this.clazz = clazz;
        gson = new GsonBuilder().setDateFormat(DATE_FORMAT).create();

    }

    public String toJson(T thing) {

        return gson.toJson(thing);

    }

    public List<T> fromFile(String filePath){

        InputStream in = this.getClass().getClassLoader().getResourceAsStream(filePath);
        JsonReader reader = null;
        List<T> results = new ArrayList<T>();
        try {
            reader = new JsonReader(new InputStreamReader(in, "UTF-8"));
            reader.beginArray();
            while (reader.hasNext()) {
                T thing = gson.fromJson(reader, clazz);
                results.add(thing);
            }
            reader.endArray();
        } catch (UnsupportedEncodingException e) {
            log.error("Unable to read encoding of file. Expected UTF-8", e);
        } catch (IOException e) {
            log.error("Unable to read file {}", filePath, e);
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    log.error("Unable to close input stream!", e);
                }
            }
        }
        return results;
    }
}

