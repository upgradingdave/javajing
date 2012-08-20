package com.upgradingdave.persist.hs2sqldb;

import com.upgradingdave.link.checker.models.Resource;
import link.checker.persist.api.PageContext;
import link.checker.persist.api.ResourceDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import javax.sql.DataSource;
import java.util.List;

public class ResourceDaoImpl extends JdbcDaoSupport implements ResourceDao {

    Logger log = LoggerFactory.getLogger(ResourceDaoImpl.class);

    final static String TABLE_NAME = "RESOURCES";

    public ResourceDaoImpl(DataSource dataSource) {

        super();

        setDataSource(dataSource);

        log.info("Created HSQLDB Implementation of ResourceDao");

    }

    @Override
    public Resource create(Resource resource) {

        log.debug("Attempting to create resource {}", resource);

        //Note: Remember that spring doesn't generate ID. The database generates the next id. Make sure the database
        // has a trigger or autoincrement facility on the ID column.
        SimpleJdbcInsert simpleJdbcInsert = new SimpleJdbcInsert(getDataSource()).withTableName(TABLE_NAME)
                .usingGeneratedKeyColumns("ID");

        SqlParameterSource parameters = new BeanPropertySqlParameterSource(resource);

        Number id = simpleJdbcInsert.executeAndReturnKey(parameters);
        resource.setId(id.intValue());
        return resource;
    }

    @Override
    public Resource findById(Integer id) {

        log.debug("Attempting to find resource by id {}", id);

        List<Resource> resources = getJdbcTemplate().query(String.format("SELECT * from %s WHERE ID=%d", TABLE_NAME, id),
                BeanPropertyRowMapper.newInstance(Resource.class));

        return resources.get(0);

    }

    @Override
    public List<Resource> findAll(PageContext page) {

        log.debug("Attempting to find all resources limit {}, offset {}", page.getSize(), page.getPage()*page.getSize());

        return getJdbcTemplate().query(String.format("SELECT * FROM %s LIMIT %d OFFSET %d", TABLE_NAME, page.getSize(), page.getPage()*page.getSize()),
                BeanPropertyRowMapper.newInstance(Resource.class));
    }

    @Override
    public Resource update(Resource resource) {

    log.debug("Attempting to update resource {}", resource);

    String sql = String.format("UPDATE %s SET URL = ?, LASTCHECKED = ?, RESPONSECODE = ?, TYPE = ? WHERE ID = ?",TABLE_NAME);

        int result = getJdbcTemplate().update(sql, resource.getUrl(), resource.getLastChecked(), resource.getResponseCode(), resource.getType(), resource.getId());

        if(result == 1) {

            return resource;

        } else {
            //TODO: really shouldn't return null here.
            log.error("Update was not successful: {}", sql);
            return null;
        }
    }

    @Override
    public void delete(Resource resource) {

        log.debug("Attempting to delete resource {}", resource);

        getJdbcTemplate().execute(String.format("DELETE FROM %s WHERE ID = %d", TABLE_NAME, resource.getId()));

    }

}
