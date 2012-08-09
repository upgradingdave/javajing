package example.generics.persist.hsqldb;

import example.generics.models.Episode;
import example.generics.persist.api.EpisodeDao;
import example.generics.persist.api.ModelDao;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.assertEquals;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:META-INF/spring/test-context.xml"})
public class EpisodeDaoTest extends ModelDaoTest<Episode, Integer>{

    @Autowired
    EpisodeDao episodeDao;

    @Override
    public ModelDao<Episode, Integer> getModelDao() {
        return episodeDao;
    }

    @Override
    public Class getClazz() {
        return Episode.class;
    }

    @Test
    public void update(){

        Episode orig = (Episode) getTestModels().get(0);

        Episode episode = episodeDao.findById(orig.getId());

        episode.setTitle("different");
        episodeDao.update(episode);

        Episode result = episodeDao.findById(orig.getId());

        assertEquals(orig.getId(), result.getId());
        assertEquals("different", result.getTitle());

    }

}
