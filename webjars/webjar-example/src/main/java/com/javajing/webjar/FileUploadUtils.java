package com.javajing.webjar;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.FalseFileFilter;
import org.apache.commons.io.filefilter.TrueFileFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Iterator;

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
    sb.append(String.format(", \"url\":\"/files/%s\"", file.getName()));
    //sb.append(String.format(", \"thumbnailUrl\":\"/files/%s\"", file.getName()));
    sb.append(String.format(", \"deleteUrl\":\"/files/%s\"", file.getName()));
    sb.append(", \"deleteType\":\"DELETE\"");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Generate json string representation of files inside the uploads directory
   */
  protected String jsonFileList(File uploadsDirectory) {
    StringBuilder sb = new StringBuilder();
    sb.append("{\"files\":[");
    Iterator<File> files = FileUtils.iterateFiles(uploadsDirectory, TrueFileFilter.INSTANCE, FalseFileFilter.INSTANCE);
    while(files.hasNext()) {
      File f = files.next();
      sb.append(jsonFile(f));
      if(files.hasNext()) {
        sb.append(",");
      }
    }
    sb.append("]}");
    return sb.toString();
  }
}
