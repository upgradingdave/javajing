package com.upgradingdave;

import static org.junit.Assert.*;

import org.junit.Test;

import java.util.List;


public class JavaJingScraperTest {
	
    @Test
    public void videoLinks(){

        JavaJingScraper javaJingScraper = new JavaJingScraper();

        List<String> episodePageLinks = javaJingScraper.getEpisodePageLinks();

        assertTrue(episodePageLinks.size()>0);

        List<String> videoLinks = javaJingScraper.getEpisodeVideoLinks(episodePageLinks);

        assertTrue(videoLinks.size()>0);

    }

    @Test
    public void mostRecent(){

        JavaJingScraper javaJingScraper = new JavaJingScraper();

        String mostRecent = javaJingScraper.getMostRecentVideoLink();

        assertNotNull(mostRecent);

        assertTrue(mostRecent.length() > 0);
    }
	
}
