package com.javajing.webjar;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.fileupload.util.Streams;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.tika.Tika;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class FileUploadServlet extends HttpServlet {

  final protected Logger log = LoggerFactory.getLogger(FileUploadServlet.class);

  public final static String DEFAULT_UPLOADS_DIR="uploads";

  private File uploadsDirectory;
  private FileUploadUtils fileUploadUtils;

  // Apache Tika is a project that helps figure out file mime types
  private Tika tika;

  // Request Attributes
  public final static String UPLOADS_DIR="UPLOADS_DIR";

  public void init(ServletConfig config) throws ServletException {
    super.init(config);

    fileUploadUtils = new FileUploadUtils();
    tika = new Tika();

    try {
      this.uploadsDirectory = fileUploadUtils.getDirectory(DEFAULT_UPLOADS_DIR);
    } catch (FileNotFoundException e) {
      throw new ServletException(e);
    }
  }

  /**
   * Simple dispatcher that returns different views based on request parameters
   */
  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

    String fileName = req.getParameter("fileName");
    File file = new File(DEFAULT_UPLOADS_DIR+"/"+ (fileName == null ? "" : fileName));

    // if '?files' parameter exists, then return json list of files
    if(req.getParameter("files") != null){
      List<File> files = fileUploadUtils.filesInsideDirectory(uploadsDirectory);
      sendFileListResponse(resp, files);
    }

    // if '?fileName=someFile' parameter exists, then return that file
    else if(fileName != null && file.exists()) {
      copyInputStreamToOuputStream(new FileInputStream(file), resp.getOutputStream());
    }

    // Otherwise, just return html for the home page
    else {
      req.getRequestDispatcher("/jsp/index.jsp").forward(req, resp);
    }

  }

  /**
   * Use Apache FileUpload API to handle multipart request
   */
  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    boolean isMultipart = ServletFileUpload.isMultipartContent(req);

    List<File> files = new ArrayList<File>();

    if(isMultipart) {

      // Create a new file upload handler
      ServletFileUpload upload = new ServletFileUpload();

      // Parse the request
      FileItemIterator iter;
      try {
        iter = upload.getItemIterator(req);
        while (iter.hasNext()) {
          FileItemStream item = iter.next();
          String name = item.getFieldName();
          InputStream stream = item.openStream();
          if (item.isFormField()) {
            log.debug("Form field " + name + " with value " + Streams.asString(stream) + " detected.");
          } else {
            log.debug("File field " + name + " with file name " + item.getName() + " detected.");

            File file = new File(DEFAULT_UPLOADS_DIR + "/" + item.getName());
            // Process the input stream
            FileOutputStream fos = new FileOutputStream(file);
            copyInputStreamToOuputStream(stream, fos);
            files.add(file);
          }
        }
      } catch (FileUploadException e) {
        log.error("Unable to process file upload", e);
      }
    }

    sendFileListResponse(resp, files);
  }

  @Override
  protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String fileName = req.getParameter("fileName");
    File file = new File(DEFAULT_UPLOADS_DIR+"/"+(fileName == null ? "" : fileName));
    if(fileName != null && file.exists()) {
      FileUtils.deleteQuietly(file);
    }

    sendFileListResponse(resp, fileUploadUtils.filesInsideDirectory(uploadsDirectory));
  }

  /**
   * Determine mime type of a file. Apache Tika Rocks!
   */
  private String getMimeType(File file) {
    try {
      return tika.detect(file);
    } catch (IOException e) {
      log.warn("Unable to determine MIME type for file {}", file.getName());
      return "application/octet-stream";
    }
  }

  /**
   * Send json response containing list of files.
   */
  private void sendFileListResponse(HttpServletResponse resp, List<File> files) throws IOException {
    resp.setContentType("application/json");
    resp.setCharacterEncoding("UTF-8");
    resp.getWriter().write(fileUploadUtils.jsonFileList(files));
    resp.getWriter().close();
  }

  /**
   * Convenience Method for copying input stream to output stream
   */
  private void copyInputStreamToOuputStream(InputStream is, OutputStream os) throws IOException {
    IOUtils.copy(is, os);
    os.flush();
    os.close();
    is.close();
  }
}


