package com.upgradingdave;

import java.util.List;

public class Main {

    public static String newline = System.getProperty("line.separator");

    public static void main(String[] args) {

        //default to list command
        String command = "list";

        if(args.length < 0 ) {
            System.out.println("Use -h for more options");

        } else {

            command = args[0];

        }

        // List all episodes
        if (command.equalsIgnoreCase("LIST")) {

            JavaJingScraper scraper = new JavaJingScraper();

            List<String> links = scraper.getEpisodeVideoLinks(scraper.getEpisodePageLinks());

            StringBuilder out = new StringBuilder();
            for (String link : links) {
                out.append(link).append(newline);
            }

            System.out.println(out.toString());

        }
        // Show link to most recent episode
        else if (command.equalsIgnoreCase("LAST")) {

            JavaJingScraper scraper = new JavaJingScraper();

            String link = scraper.getMostRecentVideoLink();

            System.out.println(link);

        }
        // Display help message
        else {

            System.out.println(usageMessage());

        }

    }

    public static String usageMessage() {

        return "Usage: javajing [ list | last ]";

    }

}
