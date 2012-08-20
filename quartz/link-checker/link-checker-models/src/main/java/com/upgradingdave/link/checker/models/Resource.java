package com.upgradingdave.link.checker.models;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;

public class Resource implements Model<Integer> {

    Logger log = LoggerFactory.getLogger(Resource.class);

    private Integer id;
    private String url;
    private Date lastChecked;
    private String responseCode;
    private String type;

    public Resource(){}

    public Resource(String url, Date lastChecked, String responseCode, String type) {
        this.url = url;
        this.lastChecked = lastChecked;
        this.responseCode = responseCode;
        this.type = type;
    }

    @Override
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }
     
    public void setUrl(String url) {
        this.url = url;
    }

    public Date getLastChecked() {
        return lastChecked;
    }
     
    public void setLastChecked(Date LastChecked) {
        this.lastChecked = LastChecked;
    }

    public String getResponseCode() {
        return responseCode;
    }
     
    public void setResponseCode(String ResponseCode) {
        this.responseCode = ResponseCode;
    }

    public String getType() {
        return type;
    }
     
    public void setType(String Type) {
        this.type = Type;
    }

    @Override
    public boolean equals(Object o){

        if(this == o) {
            return true;
        }

        if(!(o instanceof Resource)){
            return false;
        }

        Resource model = (Resource)o;

        return (this.id == null ? model.id == null : id.equals(model.id))
        && (this.url == null ? model.url == null : url.equals(model.url))
        && (this.lastChecked == null ? model.lastChecked == null : lastChecked.equals(model.lastChecked))
        && (this.responseCode == null ? model.responseCode == null : responseCode.equals(model.responseCode))
        && (this.type == null ? model.type == null : type.equals(model.type))
;
    }

    @Override
    public int hashCode() {

        int hash = 7;
        hash = 31 * hash + id;
        hash = 31 * hash + (null == url ? 0 : url.hashCode());
        hash = 31 * hash + (null == lastChecked ? 0 : lastChecked.hashCode());
        hash = 31 * hash + (null == responseCode ? 0 : responseCode.hashCode());
        hash = 31 * hash + (null == type ? 0 : type.hashCode());
        return hash;

    }

    @Override
    public String toString(){

        StringBuilder builder = new StringBuilder();
        builder.append("[");
        builder.append(this.id == null ? " Id: null" : " Id: "+id);
        builder.append(this.url == null ? " url: null" : " url: "+url);
        builder.append(this.lastChecked == null ? " lastChecked: null" : " lastChecked: "+ lastChecked);
        builder.append(this.responseCode == null ? " responseCode: null" : " responseCode: "+ responseCode);
        builder.append(this.type == null ? " type: null" : " type: "+ type);
        return builder.toString();
    }
}
