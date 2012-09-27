package com.upgradingdave;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;

public class Forecast {

    private static final Logger log = LoggerFactory.getLogger(Forecast.class);

    int code;
    Date date;
    String day;
    long high;
    long low;
    String text;

    public int getCode() {
        return code;
    }

    public Forecast() {
    }

    public void setCode(int code) {
        this.code = code;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public void setHigh(long high) {
        this.high = high;
    }

    public void setLow(long low) {
        this.low = low;
    }

}
