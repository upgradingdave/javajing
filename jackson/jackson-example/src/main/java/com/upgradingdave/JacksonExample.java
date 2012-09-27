package com.upgradingdave;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.text.SimpleDateFormat;

public class JacksonExample<T> implements Json<T>{

    Logger log = LoggerFactory.getLogger(JacksonExample.class);

    Class clazz;
    public final static String DATE_FORMAT = "dd MMM yyyy";

    public JacksonExample(Class clazz) {
        this.clazz = clazz;
    }

    @Override
    public T fromJson(String json) {

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setDateFormat(new SimpleDateFormat(DATE_FORMAT));

        //NOTE: in real world, I'd add a method to associate Mixin so that this impl
        // isn't specific to Forcast objects, but I'll leave it this way so it is
        // the same as what is shown in the video.
        objectMapper.addMixInAnnotations(Forecast.class, Mixin.class);

        try {
            return (T) objectMapper.readValue(json, clazz);
        } catch (IOException e) {
            log.error("Unable to deserialize json to object", e);
        }
        return null;
    }

    @Override
    public String toJson(T object) {

        ObjectMapper mapper = new ObjectMapper().setDateFormat(new SimpleDateFormat(DATE_FORMAT));

        //Can also use annotations for this
        mapper.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);

        ObjectWriter writer = mapper.writer();

        Writer output = new StringWriter();

        try {
            writer.writeValue(output, object);
        } catch (IOException e) {
            log.error("Unable to serialize object to json", e);
        }

        return output.toString();

    }

}
