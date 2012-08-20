package link.checker.persist.api;

import java.util.List;

public interface ModelDao<T, ID> {

    T create(T model);

    void delete(T model);

    T update(T model);

    T findById(ID id);

    List<T> findAll(PageContext page);

}
