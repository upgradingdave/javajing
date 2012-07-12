package com.upgradingdave;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class FixtureHelper<T> {

    private static final Logger log = LoggerFactory.getLogger(FixtureHelper.class);

    ModelDao<T> modelDao;

    public FixtureHelper(ModelDao<T> modelDao) {
        this.modelDao = modelDao;
    }

    /**
     * Load fixture into DB
     * @param clazz type of class necessary because of type erasure
     */
    public List<T> load(Class clazz) {

        log.info("Attempting to load {}(s) into database", clazz.getSimpleName().toLowerCase());

        JsonFixture<T> jsonFixture = new JsonFixture<T>(clazz);
        List<T> results = jsonFixture.fromFile(String.format("fixtures/%ss.json", clazz.getSimpleName().toLowerCase()));

        List<T> savedToDb = new ArrayList<T>();
        for(T result : results) {
            savedToDb.add(modelDao.create(result));
        }

        return savedToDb;
    }

    /**
     * Remove all objects from db
     */
    public void deleteAll() {

        log.info("Attempting to delete all from database");
        modelDao.deleteAll();

    }
}
