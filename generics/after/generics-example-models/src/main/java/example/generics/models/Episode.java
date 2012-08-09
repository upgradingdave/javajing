package example.generics.models;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Episode implements Model<Integer>{

    Logger log = LoggerFactory.getLogger(Episode.class);

    private Integer id;
    private String title;
    private String summary;
    private Integer episodeNum;

    @Override
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }
     
    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }
     
    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Integer getEpisodeNum() {
        return episodeNum;
    }
     
    public void setEpisodeNum(Integer episodeNum) {
        this.episodeNum = episodeNum;
    }

    @Override
    public boolean equals(Object o){

        if(this == o) {
            return true;
        }

        if(!(o instanceof Episode)){
            return false;
        }

        Episode model = (Episode)o;

        return (this.id == null ? model.id == null : id.equals(model.id))
        && (this.title == null ? model.title == null : title.equals(model.title))
        && (this.summary == null ? model.summary == null : summary.equals(model.summary))
        && (this.episodeNum == null ? model.episodeNum == null : episodeNum.equals(model.episodeNum))
;
    }

    @Override
    public int hashCode() {

        int hash = 7;
        hash = 31 * hash + id;
        hash = 31 * hash + (null == title ? 0 : title.hashCode());
        hash = 31 * hash + (null == summary ? 0 : summary.hashCode());
        hash = 31 * hash + (null == episodeNum ? 0 : episodeNum.hashCode());
        return hash;

    }

    @Override
    public String toString(){

        StringBuilder builder = new StringBuilder();
        builder.append("[");
        builder.append(this.id == null ? " Id: null" : " Id: "+id);
        builder.append(this.title == null ? " title: null" : " title: "+title);
        builder.append(this.summary == null ? " summary: null" : " summary: "+summary);
        builder.append(this.episodeNum == null ? " episodeNum: null" : " episodeNum: "+episodeNum);
        return builder.toString();
    }
}
