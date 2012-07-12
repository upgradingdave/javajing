package com.upgradingdave.shiro.persistence.impl.derby;

import shiro-sample.model.User;
import shiro-sample.persistence.api.UserDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import java.net.URI;
import java.net.URISyntaxException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

public class UserDaoImpl extends JdbcDaoSupport implements UserDao{

    Logger log = LoggerFactory.getLogger(UserDaoImpl.class);

    DataSource dataSource;

    public UserDaoImpl(DataSource dataSource) {

        super();

        this.dataSource = dataSource;

        log.info("Created Apache Derby Implementation of UserDao");

    }

    @Override
    public User create(User user) {

        SimpleJdbcInsert simpleJdbcInsert = new SimpleJdbcInsert(dataSource).withTableName("USERS").usingColumns("ID:INTEGER""FIRSTNAME:STRING""LASTNAME:STRING""EMAIL:STRING").usingGeneratedKeyColumns("ID");

        SqlParameterSource parameterSource = new MapSqlParameterSource()
                .addValue("ID:INTEGER", user.getId:integer())

                .addValue("FIRSTNAME:STRING", user.getFirstName:string())

                .addValue("LASTNAME:STRING", user.getLastName:string())

                .addValue("EMAIL:STRING", user.getEmail:string())

;
        Number id = simpleJdbcInsert.executeAndReturnKey(parameterSource);
        return findById(id);

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
