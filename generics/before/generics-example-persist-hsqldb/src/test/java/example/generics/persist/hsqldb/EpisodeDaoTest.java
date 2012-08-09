package example.generics.persist.hsqldb;

import com.upgradingdave.fixtures.JsonFixture;
import example.generics.models.Episode;
import example.generics.persist.api.EpisodeDao;
import example.generics.persist.api.PageContext;
import example.generics.persist.api.PageImpl;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:META-INF/spring/test-context.xml"})
public class EpisodeDaoTest {

    @Autowired
    EpisodeDao episodeDao;

    List<Episode> testModels;

    public EpisodeDao getModelDao(){
        return episodeDao;
    }

    public Class getClazz(){
        return Episode.class;
    }

    public List<Episode> getTestModels() {
        return testModels;
    }

    @Before
    public void setUp() {

        testModels = new ArrayList<Episode>();

        JsonFixture<Episode> jsonFixture = new JsonFixture<Episode>(getClazz());

        jsonFixture.withEachJsonObjectFromFile(new JsonFixture.JsonProcessor<Episode>() {
            @Override
            public void process(Episode user) {
                testModels.add(getModelDao().create(user));
            }
        });

        assertTrue(testModels.size()>0);

    }

    @After
    public void tearDown(){

        for(Episode model : testModels) {
            getModelDao().delete(model);
        }

    }

    @Test
    public void findById(){

        Episode model = testModels.get(0);
        Episode result = getModelDao().findById(model.getId());
        assertEquals(model, result);

    }

    @Test
    public void findAll(){

        PageContext pageContext = new PageImpl(0,1);
        List<Episode> results = getModelDao().findAll(pageContext);
        assertTrue(results.size() == 1);

        pageContext = new PageImpl(1,1);
        results = getModelDao().findAll(pageContext);
        assertTrue(results.size() == 1);

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
