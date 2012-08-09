package example.generics.persist.hsqldb;

import com.upgradingdave.fixtures.JsonFixture;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import example.generics.models.Model;
import example.generics.persist.api.ModelDao;
import example.generics.persist.api.PageContext;
import example.generics.persist.api.PageImpl;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public abstract class ModelDaoTest<T extends Model<ID>,ID> {

    public abstract ModelDao<T, ID> getModelDao();

    public abstract Class getClazz();

    List<T> testModels;

    public List<T> getTestModels() {
        return testModels;
    }

    @Before
    public void setUp() {

        testModels = new ArrayList<T>();

        JsonFixture<T> jsonFixture = new JsonFixture<T>(getClazz());

        jsonFixture.withEachJsonObjectFromFile(new JsonFixture.JsonProcessor<T>() {
            @Override
            public void process(T user) {
                testModels.add(getModelDao().create(user));
            }
        });

        assertTrue(testModels.size()>0);

    }

    @After
    public void tearDown(){

        for(T model : testModels) {
            getModelDao().delete(model);
        }

    }

    @Test
    public void findById(){

        Model<ID> model = testModels.get(0);
        Model result = getModelDao().findById(model.getId());
        assertEquals(model, result);

    }

    @Test
    public void findAll(){

        PageContext pageContext = new PageImpl(0,1);
        List<T> results = getModelDao().findAll(pageContext);
        assertTrue(results.size() == 1);

        pageContext = new PageImpl(1,1);
        results = getModelDao().findAll(pageContext);
        assertTrue(results.size() == 1);

    }

    @Test
    public abstract void update();

}
