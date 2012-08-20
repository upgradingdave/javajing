package com.upgradingdave.linkchecker;

import com.upgradingdave.link.checker.models.Resource;
import link.checker.persist.api.ResourceDao;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class LinkCheckJob implements Job {

    private static final Logger log = LoggerFactory.getLogger(LinkCheckJob.class);

    public static final String RESOURCE_DAO = "resourceDao";

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {

        ResourceDao resourceDao = (ResourceDao) context.getJobDetail().getJobDataMap().get(RESOURCE_DAO);

        JavaJingScraper javaJingScraper = new JavaJingScraper();

        List<Resource> resources = javaJingScraper.checkEpisodePageLinks();

        for(Resource resource : resources) {

            resourceDao.create(resource);

        }
    }
}
