package com.upgradingdave.linkchecker;

import com.upgradingdave.link.checker.models.Resource;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class JavaJingScraper {

    Logger log = LoggerFactory.getLogger(JavaJingScraper.class);

    public static final String URL = "http://javajing.com";

    private DefaultHttpClient httpclient;

    public JavaJingScraper() {

        httpclient = new DefaultHttpClient();
    }

    public List<String> getEpisodeVideoLinks(List<String> episodePageLinks) {

        List<String> links = new ArrayList<String>();
        for(String episodePageLink : episodePageLinks) {

            log.debug("Attempting to retreive video link from {}", URL + episodePageLink);

            Document document = get(URL + episodePageLink);

            links.add(getEpisodeVideoLink(document));

        }

        return links;

    }


    public List<String> getEpisodePageLinks() {

        log.debug("Attempting to retreive relative links to episodes");

        Document document = get(URL);

        Elements elements = document.select(".teaser a");

        List<String> links = new ArrayList<String>();
        for(Element enclosure : elements) {

            links.add(enclosure.attr("href"));
            log.debug("Found episode link: {}", enclosure.attr("href"));

        }

        return links;

    }

    /**
     * Attempt to retrieve each javajing episode page
     */
    public List<Resource> checkEpisodePageLinks() {

        List<Resource> resources = new ArrayList<Resource>();
        List<String> pageLinks = getEpisodePageLinks();
        for(String pageLink : pageLinks) {

            log.info("Checking URL: {}", URL+pageLink);

            HttpGet httpGet = new HttpGet(URL+pageLink);

            try {

                HttpResponse response = httpclient.execute(httpGet);

                String responseCode = new Integer(response.getStatusLine().getStatusCode()).toString();

                resources.add(new Resource(pageLink, new Date(), responseCode, "page"));

            } catch (IOException e) {
                log.error("Unable to connect. Something really bad happened", e);
            } finally {
                httpGet.releaseConnection();
            }
        }
        return resources;
    }


    /**
     * Parses the front page to find most recent video link
     * @return link to the most recently published episode mp4
     */
    public String getMostRecentVideoLink(){

        Document document = get(URL);
        String pageLink = document.select("#header-left a").attr("href");

        document = get(URL + pageLink);

        return getEpisodeVideoLink(document);

    }

    /**
     * Fetch a html document for a url
     * @param url location to fetch
     * @return parsed representation of html page
     */
    private Document get(String url){

        try {
            return Jsoup.connect(url).get();
        } catch (IOException e) {
            log.error("Unable to retreive page {}", url, e);
        }

        return null;

    }

    /**
     * Given a Episode Page, extract the link to the video
     * @return url to the mp4
     */
    private String getEpisodeVideoLink(Document episodePage){

        String videoLink = episodePage.select("video source").attr("src");
        log.debug("Found video {}", videoLink);
        return videoLink;

    }

}
