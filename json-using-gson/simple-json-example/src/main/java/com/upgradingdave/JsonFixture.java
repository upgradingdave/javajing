package com.upgradingdave;

import com.google.gson.Gson;
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

    private static final Logger log = LoggerFactory.getLogger(JsonFixture.class);

    private Gson gson;
    private Class clazz;

    public JsonFixture(Class clazz) {
        this.clazz = clazz;
        gson = new Gson();
    }

    List<T> fromFile(String filepath) {

        InputStream in = this.getClass().getClassLoader().getResourceAsStream(filepath);
        JsonReader reader = null;
        List<T> results = new ArrayList<T>();

        try {
            reader = new JsonReader(new InputStreamReader(in, "UTF-8"));
            reader.beginArray();
            while(reader.hasNext()){
                T nextObject = gson.fromJson(reader, clazz);
                results.add(nextObject);
            }
            reader.endArray();
            return results;
        } catch (UnsupportedEncodingException e) {
            log.error("Unable to read json file", e);
        } catch (IOException e) {
            log.error("Unable to find file", e);
        } finally {
            if(reader == null){
                try {
                    reader.close();
                } catch (IOException e) {
                    log.error("Unable to close json reader", e);
                }
            }
        }
        return null;
    }

}
