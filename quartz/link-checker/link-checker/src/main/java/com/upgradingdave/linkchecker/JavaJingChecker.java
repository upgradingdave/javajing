package com.upgradingdave.linkchecker;

import com.upgradingdave.link.checker.models.Resource;
import link.checker.persist.api.PageImpl;
import link.checker.persist.api.ResourceDao;
import org.quartz.*;
import org.quartz.impl.StdSchedulerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.IOException;
import java.util.List;

import static org.quartz.JobBuilder.newJob;
import static org.quartz.SimpleScheduleBuilder.simpleSchedule;
import static org.quartz.TriggerBuilder.newTrigger;

/**
 * Runs as Quartz job to check periodically to ensure links on the javajing site are working
 */
public class JavaJingChecker {

    private static final Logger log = LoggerFactory.getLogger(JavaJingChecker.class);

    Scheduler scheduler;
    ResourceDao resourceDao;

    /**
     * Starts a job that periodically checks that all pages on javajing.com are accessible
     * @param args
     */
    public static void main(String[] args) throws SchedulerException {

        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("META-INF/spring/link-checker.xml");
        ResourceDao resourceDao = (ResourceDao) applicationContext.getBean("resourceDao");

        JavaJingChecker javaJingChecker = new JavaJingChecker(resourceDao);

        if(args.length > 0) {

            try {

                javaJingChecker.reportLatestChecks();

            } catch (Exception e) {
                log.error("Unable to find latest link checks", e);
            } finally {
                return;
            }


        } else {

            try {

                javaJingChecker.createAndScheduleJob();

                javaJingChecker.startJob();

                System.out.println("Job Started successfully, Press any key to exit");

                System.in.read();

                javaJingChecker.stopJob();

            } catch (SchedulerException e) {
                log.error("Unable to start job", e);
            } catch (IOException e) {
                log.error("Problem occured related to stdin", e);
            } finally {
                return;
            }
        }
    }

    public JavaJingChecker(ResourceDao resourceDao) throws SchedulerException {

        this.scheduler = StdSchedulerFactory.getDefaultScheduler();

        this.resourceDao = resourceDao;

    }

    public void reportLatestChecks(){

        List<Resource> latest = this.resourceDao.findAll(new PageImpl(0, 30));
        for(Resource resource : latest) {
            System.out.println(resource);
        }

    }

    public void createAndScheduleJob() throws SchedulerException {

        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put(LinkCheckJob.RESOURCE_DAO, resourceDao);

        // define the job and tie it to our LinkCheckJob class
        JobDetail job = newJob(LinkCheckJob.class)
                .withIdentity("link-check", "javajing")
                .usingJobData(jobDataMap)
                .build();

        // Trigger the job to run now, and then repeat every 40 seconds
        Trigger trigger = newTrigger()
                .withIdentity("every-40-seconds", "javajing")
                .startNow()
                .withSchedule(simpleSchedule()
                        .withIntervalInSeconds(40)
                        .repeatForever())
                .build();

        // Tell quartz to schedule the job using our trigger
        scheduler.scheduleJob(job, trigger);

    }

    public void startJob() throws SchedulerException {
        scheduler.start();
    }

    public void stopJob() throws SchedulerException {
        scheduler.shutdown();
    }
}
