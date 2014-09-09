package com.javajing.webjar;

import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.Test;

import java.io.File;
import java.io.IOException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class FileUploadUtilsTest {

  FileUploadUtils fileUploadUtils;
  File uploadsDirectory;

  File testFile1;
  File testFile2;

  boolean initialized = false;

  /**
   * Ensure that some test files exist
   */
  @Before
  public void setup() throws IOException {
    if(!initialized) {

      fileUploadUtils = new FileUploadUtils();

      // Clear out directory
      uploadsDirectory = fileUploadUtils.getDirectory(FileUploadServlet.DEFAULT_UPLOADS_DIR);
      FileUtils.deleteDirectory(uploadsDirectory);

      // Re-create uploads directory
      uploadsDirectory = fileUploadUtils.getDirectory(FileUploadServlet.DEFAULT_UPLOADS_DIR);

      // Add some files
      testFile1 = new File(FileUploadServlet.DEFAULT_UPLOADS_DIR + "/testFile1.txt");
      assertTrue(testFile1.createNewFile());
      testFile2 = new File(FileUploadServlet.DEFAULT_UPLOADS_DIR + "/testFile2.txt");
      assertTrue(testFile2.createNewFile());

      initialized = true;
    }
  }

  @Test
  public void testJsonFile() {
    assertEquals(
            "{\"name\":\"testFile1.txt\", \"size\":0, \"url\":\"/files/testFile1.txt\", \"deleteUrl\":\"/files/testFile1.txt\", \"deleteType\":\"DELETE\"}",
            fileUploadUtils.jsonFile(testFile1));
  }

  @Test
  public void testJsonFileList() {
    assertEquals(
            "{\"files\":[{\"name\":\"testFile1.txt\", \"size\":0, \"url\":\"/files/testFile1.txt\", \"deleteUrl\":\"/files/testFile1.txt\", \"deleteType\":\"DELETE\"},{\"name\":\"testFile2.txt\", \"size\":0, \"url\":\"/files/testFile2.txt\", \"deleteUrl\":\"/files/testFile2.txt\", \"deleteType\":\"DELETE\"}]}",
            fileUploadUtils.jsonFileList(new File(FileUploadServlet.DEFAULT_UPLOADS_DIR)));
  }

}