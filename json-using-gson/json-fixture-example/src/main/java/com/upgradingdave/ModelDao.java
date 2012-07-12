package com.upgradingdave;

public interface ModelDao<T> {

    public T create(T model);

    public void deleteAll();

}
