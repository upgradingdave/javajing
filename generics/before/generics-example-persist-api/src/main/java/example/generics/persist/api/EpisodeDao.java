package example.generics.persist.api;

import example.generics.models.Episode;

import java.util.List;

public interface EpisodeDao {

    Episode create(Episode model);

    void delete(Episode model);

    Episode update(Episode model);

    Episode findById(Integer id);

    List<Episode> findAll(PageContext page);

}
