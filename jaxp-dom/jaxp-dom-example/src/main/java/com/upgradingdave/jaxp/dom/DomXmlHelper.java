package com.upgradingdave.jaxp.dom;

import com.upgradingdave.jaxp.XmlHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class DomXmlHelper implements XmlHelper {

    private static final Logger log = LoggerFactory.getLogger(DomXmlHelper.class);

    File xmlFile;

    public DomXmlHelper(File xmlFile) {
        this.xmlFile = xmlFile;
    }

    @Override
    public List<String> findValues(String tagName) {

        DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();

        List<String> results = new ArrayList<String>();
        try {

            DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
            Document doc = documentBuilder.parse(xmlFile);

            NodeList nodeList = doc.getElementsByTagName(tagName);

            for(int i=0; i<nodeList.getLength(); i++){
                results.add(nodeList.item(i).getFirstChild().getNodeValue());
            }

            return results;

        } catch (ParserConfigurationException e) {
            log.error("Unable to create documentBuilder", e);
        } catch (SAXException e) {
            log.error("Unable to parse xml file {}", xmlFile, e);
        } catch (IOException e) {
            log.error("Unable to find or read file {}", xmlFile, e);
        }

        return null;

    }
}
