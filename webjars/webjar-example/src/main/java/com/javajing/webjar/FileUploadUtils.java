package com.javajing.webjar;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.FalseFileFilter;
import org.apache.commons.io.filefilter.TrueFileFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class FileUploadUtils {

  final protected Logger log = LoggerFactory.getLogger(FileUploadUtils.class);

  /**
   * Ensure directory named 'dirname' exists
   */
  protected File getDirectory(String dirName) throws FileNotFoundException {
    File dir = new File(dirName);
    if(!dir.exists()) {
      log.warn("Directory doesn't exist, so creating it now");
      if(dir.mkdir()) {
        return dir;
      } else {
        throw new FileNotFoundException("Unable to create Uploads Directory");
      }
    }

    return dir;
  }

  /**
   * Generate json string representation of a file
   */
  protected String jsonFile(File file) {
    StringBuilder sb = new StringBuilder("{");
    sb.append(String.format("\"name\":\"%s\"", file.getName()));
    sb.append(String.format(", \"size\":%d",FileUtils.sizeOf(file)));
    sb.append(String.format(", \"url\":\"/fileUpload?fileName=%s\"", file.getName()));
    //sb.append(String.format(", \"thumbnailUrl\":\"/fileUpload?fileName=%s\"", file.getName()));
    sb.append(String.format(", \"deleteUrl\":\"/fileUpload?fileName=%s\"", file.getName()));
    sb.append(", \"deleteType\":\"DELETE\"");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Generate list of files
   */
  protected List<File> filesInsideDirectory(File uploadsDirectory) {
    List<File> fileList = new ArrayList<File>();
    Iterator<File> files = FileUtils.iterateFiles(uploadsDirectory, TrueFileFilter.INSTANCE, FalseFileFilter.INSTANCE);
    while(files.hasNext()) {
      File file = files.next();
      fileList.add(file);
    }
    return fileList;
  }

  /**
   * Generate json string representation of files inside the uploads directory
   */
  protected String jsonFileList(List<File> files) {
    StringBuilder sb = new StringBuilder();
    sb.append("{\"files\":[");
    for(int i=0;i<files.size();i++) {
      File f = files.get(i);
      sb.append(jsonFile(f));
      if(i<files.size()-1) {
        sb.append(",");
      }
    }
    sb.append("]}");
    return sb.toString();
  }
}
