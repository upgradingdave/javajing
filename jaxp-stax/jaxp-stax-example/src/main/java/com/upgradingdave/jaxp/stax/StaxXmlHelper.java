package com.upgradingdave.jaxp.stax;

import com.upgradingdave.jaxp.XmlHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import javax.xml.stream.events.XMLEvent;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

public class StaxXmlHelper implements XmlHelper {

    private static final Logger log = LoggerFactory.getLogger(StaxXmlHelper.class);

    File xmlFile;
    boolean insideTag = false;
    List<String> results;

    public StaxXmlHelper(File xmlFile) {
        this.xmlFile = xmlFile;
        results = new ArrayList<String>();
    }

    @Override
    public List<String> findValues(String tagName) {

        XMLInputFactory f = XMLInputFactory.newInstance();
        try {
            XMLStreamReader xmlStreamReader= f.createXMLStreamReader(new FileInputStream(xmlFile));

            while (xmlStreamReader.hasNext()) {

                int event = xmlStreamReader.next();

                if(event == XMLEvent.START_ELEMENT) {

                    String currentTagName = xmlStreamReader.getLocalName();
                    if(currentTagName.equals(tagName)) {
                        insideTag = true;
                    }

                } else if(event == XMLEvent.CHARACTERS) {

                    if(insideTag) {

                        results.add(xmlStreamReader.getText());

                    }

                } else if(event == XMLEvent.END_ELEMENT) {

                    if(xmlStreamReader.getLocalName().equals(tagName)) {

                        insideTag = false;

                    }

                }
            }

        } catch (XMLStreamException e) {
            log.error("unable to read xml stream", e);
        } catch (FileNotFoundException e) {
            log.error("unable to find file {}", xmlFile, e);
        }
        return results;
    }
}
