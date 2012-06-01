package com.upgradingdave.javajing.tools;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.FileFilterUtils;
import org.apache.commons.io.filefilter.IOFileFilter;
import org.apache.commons.io.filefilter.RegexFileFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.Collection;

public class SiteHelper {

    private static final Logger log = LoggerFactory.getLogger(SiteHelper.class);

    public static final String ORG_PROJECT_DIR = "../";
    public static final String ORG_POSTS_DIR = "src/main/webapp/org/_posts/";

    public static void main(String[] args){

        log.debug("Running SiteHelper main to process org show notes files");

        SiteHelper siteHelper = new SiteHelper();
        try {
            siteHelper.processShowNotes(new File(ORG_PROJECT_DIR));
        } catch (IOException e) {
            log.error("Unable to process files", e);
        }

    }

    /**
     * Recursively find all show notes org files excluding any org files inside _posts directory
     * @param dir Directory that contains org show notes files.
     */
    public Collection<File> findShowNotes(File dir){

        IOFileFilter fileFilter = new RegexFileFilter("^(\\d\\d\\d\\d)-(\\d\\d)-(\\d\\d)-.*\\.org$");
        return FileUtils.listFiles(dir, fileFilter, FileFilterUtils.notFileFilter(FileFilterUtils.nameFileFilter("_posts")));

    }

    /**
     * Move show notes into jekyll _posts directory
     */
    public void processShowNotes(File dir) throws IOException {

        for(File f : findShowNotes(dir)){

            log.info("Attempting to move {} to {}", f, ORG_POSTS_DIR);
            FileUtils.copyFileToDirectory(f, new File(ORG_POSTS_DIR), false);

        }
    }
}
