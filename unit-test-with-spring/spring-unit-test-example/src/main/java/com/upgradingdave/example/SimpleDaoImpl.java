package com.upgradingdave.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SimpleDaoImpl implements SimpleDao {

    private static final Logger log = LoggerFactory.getLogger(SimpleDaoImpl.class);

    SimpleBeanDb simpleBeanDb;

    public SimpleDaoImpl(SimpleBeanDb simpleBeanDb) {
        this.simpleBeanDb = simpleBeanDb;
    }

    @Override
    public SimpleBean find(Long id) {

        log.info("Attempting to find SimpleBean with id {}", id);

        simpleBeanDb.connect();
        return simpleBeanDb.getSimpleBean(id);

    }
}
