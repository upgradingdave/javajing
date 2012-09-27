package com.upgradingdave;

public interface Json<T> {

    public T fromJson(String json);

    public String toJson(T object);

}
