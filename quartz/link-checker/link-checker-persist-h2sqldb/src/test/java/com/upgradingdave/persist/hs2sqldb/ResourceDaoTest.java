package com.upgradingdave.persist.hs2sqldb;

import com.upgradingdave.link.checker.models.Resource;
import link.checker.persist.api.ModelDao;
import link.checker.persist.api.ResourceDao;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.assertEquals;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:META-INF/spring/test-context.xml"})
public class ResourceDaoTest extends ModelDaoTest<Resource, Integer>{
    @Autowired
    ResourceDao resourceDao;

    @Override
    public ModelDao<Resource, Integer> getModelDao() {
        return resourceDao;
    }

    @Override
    public Class getClazz() {
        return Resource.class;
    }

    @Test
    public void update(){

        Resource orig = (Resource) getTestModels().get(0);

        Resource resource = resourceDao.findById(orig.getId());

        resource.setType("different");
        resourceDao.update(resource);

        Resource result = resourceDao.findById(orig.getId());

        assertEquals(orig.getId(), result.getId());
        assertEquals("different", result.getType());

    }

}
