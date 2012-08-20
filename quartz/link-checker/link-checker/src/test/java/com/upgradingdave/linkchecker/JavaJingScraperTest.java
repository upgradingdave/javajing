package com.upgradingdave.linkchecker;

import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertTrue;


public class JavaJingScraperTest {

    @Test
    public void videoLinks(){

        JavaJingScraper javaJingScraper = new JavaJingScraper();

        List<String> episodePageLinks = javaJingScraper.getEpisodePageLinks();

        assertTrue(episodePageLinks.size()>0);

        List<String> videoLinks = javaJingScraper.getEpisodeVideoLinks(episodePageLinks);

        assertTrue(videoLinks.size()>0);

    }

}
