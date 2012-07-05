package com.upgradingdave;

import json.model.Contact;
import json.persistence.api.ContactDao;
import json.persistence.api.PageContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import javax.sql.DataSource;
import java.util.List;

public class ContactDaoImpl extends JdbcDaoSupport implements ContactDao{

    Logger log = LoggerFactory.getLogger(ContactDaoImpl.class);

    DataSource dataSource;

    public ContactDaoImpl(DataSource dataSource) {

        super();

        this.dataSource = dataSource;

        log.info("Created Apache Derby Implementation of ContactDao");

    }

    @Override
    public Contact create(Contact contact) {

        SimpleJdbcInsert simpleJdbcInsert = new SimpleJdbcInsert(dataSource).withTableName("CONTACTS").usingColumns("FIRSTNAME","LASTNAME","EMAIL").usingGeneratedKeyColumns("ID");

        SqlParameterSource parameterSource = new MapSqlParameterSource()
                .addValue("FIRSTNAME", contact.getFirstName())
                .addValue("LASTNAME", contact.getLastName())
                .addValue("EMAIL", contact.getEmail());
        Number id = simpleJdbcInsert.executeAndReturnKey(parameterSource);
        return findById(id.toString());

    }

@Override
public Contact update(Contact contact) {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
}

@Override
public void delete(Contact contact) {
        //To change body of implemented methods use File | Settings | File Templates.
        }

@Override
public Contact findById(String id) {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
}

@Override
public List<Contact> findAll(PageContext page) {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
}

}
