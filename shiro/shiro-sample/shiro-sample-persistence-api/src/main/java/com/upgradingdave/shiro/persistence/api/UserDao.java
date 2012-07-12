package com.upgradingdave.shiro.persistence.api;

import shiro-sample.model.User;
import java.util.List;

public interface UserDao {

    User create(User user);

    User update(User user);

    void delete(User user);

    User findById(String id);

    List<User> findAll(PageContext page);

}
