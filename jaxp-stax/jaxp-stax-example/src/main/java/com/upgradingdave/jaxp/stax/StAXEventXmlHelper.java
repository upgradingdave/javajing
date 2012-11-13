package com.upgradingdave.jaxp.stax;

import com.upgradingdave.jaxp.XmlHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.xml.stream.XMLEventReader;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.events.XMLEvent;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

public class StAXEventXmlHelper implements XmlHelper {

    final static Logger log = LoggerFactory.getLogger(StAXEventXmlHelper.class);

    File xmlFile;

    public StAXEventXmlHelper(File xmlFile) {
        this.xmlFile = xmlFile;
    }

    @Override
    public List<String> findValues(String tagName) {

        boolean insideTag = false;

        List<String> results = new ArrayList<String>();

        XMLInputFactory f = XMLInputFactory.newInstance();

        try {
            XMLEventReader xmlEventReader = f.createXMLEventReader(new FileInputStream(xmlFile ));

            while(xmlEventReader.hasNext()) {

                XMLEvent event = xmlEventReader.nextEvent();

                if(event.isStartElement()) {

                    if(event.asStartElement().getName().getLocalPart().equals(tagName)){
                        insideTag = true;
                    }

                }

                if(event.isCharacters()) {

                    if(insideTag) {
                        results.add(event.asCharacters().getData());
                    }

                }

                if(event.isEndElement()) {

                    if(event.asEndElement().getName().getLocalPart().equals(tagName)) {
                        insideTag = false;
                    }

                }
            }

            return results;

        } catch (XMLStreamException e) {
            log.error("Unable to parse xml {}", xmlFile, e);
        } catch (FileNotFoundException e) {
            log.error("Unable to find or read file {}", xmlFile, e);
        }

        return null;
    }

}
