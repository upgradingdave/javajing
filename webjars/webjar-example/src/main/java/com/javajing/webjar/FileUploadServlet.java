package com.javajing.webjar;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.fileupload.util.Streams;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

public class FileUploadServlet extends HttpServlet {

  final protected Logger log = LoggerFactory.getLogger(FileUploadServlet.class);

  public final static String DEFAULT_UPLOADS_DIR="uploads";

  private File uploadsDirectory;
  private FileUploadUtils fileUploadUtils;

  // Request Attributes
  public final static String UPLOADS_DIR="UPLOADS_DIR";

  public void init(ServletConfig config) throws ServletException {
    super.init(config);

    fileUploadUtils = new FileUploadUtils();

    try {
      this.uploadsDirectory = fileUploadUtils.getDirectory(DEFAULT_UPLOADS_DIR);
    } catch (FileNotFoundException e) {
      throw new ServletException(e);
    }
  }

  /**
   * If the request has parameter "?files" then return json representation of files inside the uploads directory
   * Otherwise, just serve index.jsp
   */
  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

    if(req.getParameter("files") == null){
      req.getRequestDispatcher("/jsp/index.jsp").forward(req, resp);
    } else {
      sendFileListResponse(resp);
    }

  }

  private void sendFileListResponse(HttpServletResponse resp) throws IOException {
    resp.setContentType("application/json");
    resp.setCharacterEncoding("UTF-8");
    resp.getWriter().write(fileUploadUtils.jsonFileList(this.uploadsDirectory));
    resp.getWriter().close();
  }

  /**
   * Use Apache FileUpload API to handle multipart request
   */
  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    boolean isMultipart = ServletFileUpload.isMultipartContent(req);

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

            // Process the input stream
            FileWriter fw = new FileWriter(new File(DEFAULT_UPLOADS_DIR + "/" + item.getName()));
            IOUtils.copy(stream, fw);
            stream.close();
          }
        }
      } catch (FileUploadException e) {
        log.error("Unable to process file upload", e);
      }
    }

    sendFileListResponse(resp);

  }
}


