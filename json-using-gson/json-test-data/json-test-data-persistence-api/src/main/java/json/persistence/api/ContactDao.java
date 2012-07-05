package json.persistence.api;

import json.model.Contact;

import java.util.List;

public interface ContactDao {

    Contact create(Contact contact);

    Contact update(Contact contact);

    void delete(Contact contact);

    Contact findById(String id);

    List<Contact> findAll(PageContext page);

}
