<%@ page import="java.util.Iterator" %>
<%@ page import="java.io.File" %>
<%@ page import="org.apache.commons.io.FileUtils" %>
<%@ page import="com.javajing.webjar.FileUploadServlet" %>
<%@page language="java" contentType="text/html" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FileUploads</title>

  <!-- Bootstrap -->
  <link href="/webjars/bootstrap/3.2.0/css/bootstrap.min.css" rel="stylesheet">

  <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src="/webjars/html5shiv/3.7.2/html5shiv.min.js"></script>
  <script src="/webjars/respond/1.4.2/dest/respond.min.js"></script>
  <![endif]-->

  <!-- Generic page styles -->
  <link rel="stylesheet" href="/webjars/jquery-file-upload/9.5.7/css/style.css">
  <!-- CSS to style the file input field as button and adjust the Bootstrap progress bars -->
  <link rel="stylesheet" href="/webjars/jquery-file-upload/9.5.7/css/jquery.fileupload.css">
</head>
<body>
<!-- The file upload form used as target for the file upload widget -->
<form id="fileupload" action="" method="POST" enctype="multipart/form-data">
  <!-- Redirect browsers with JavaScript disabled to the origin page -->
  <noscript><input type="hidden" name="redirect" value="http://blueimp.github.io/jQuery-File-Upload/"></noscript>
  <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->
  <div class="row fileupload-buttonbar">
    <div class="col-lg-7">
      <!-- The fileinput-button span is used to style the file input field as button -->
      <span class="btn btn-success fileinput-button">
        <i class="glyphicon glyphicon-plus"></i>
        <span>Add files...</span>
        <input type="file" name="files[]" multiple>
      </span>
      <button type="submit" class="btn btn-primary start">
        <i class="glyphicon glyphicon-upload"></i>
        <span>Start upload</span>
      </button>
      <button type="reset" class="btn btn-warning cancel">
        <i class="glyphicon glyphicon-ban-circle"></i>
        <span>Cancel upload</span>
      </button>
      <%--<button type="button" class="btn btn-danger delete">
        <i class="glyphicon glyphicon-trash"></i>
        <span>Delete</span>
      </button>--%>
      <%--<input type="checkbox" class="toggle">--%>
      <!-- The global file processing state -->
      <span class="fileupload-process"></span>
    </div>
    <!-- The global progress state -->
    <div class="col-lg-5 fileupload-progress fade">
      <!-- The global progress bar -->
      <div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar progress-bar-success" style="width:0%;"></div>
      </div>
      <!-- The extended global progress state -->
      <div class="progress-extended">&nbsp;</div>
    </div>
  </div>
  <!-- The table listing the files available for upload/download -->
  <table role="presentation" class="table table-striped"><tbody class="files"></tbody></table>
</form>
<!-- The template to display files available for upload -->
<script id="template-upload" type="text/x-tmpl">
  {% for (var i=0, file; file=o.files[i]; i++) { %}
  <tr class="template-upload fade">
    <td>
      <span class="preview"></span>
    </td>
    <td>
      <p class="name">{%=file.name%}</p>
      <strong class="error text-danger"></strong>
    </td>
    <td>
      <p class="size">Processing...</p>
      <div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="progress-bar progress-bar-success" style="width:0%;"></div></div>
    </td>
    <td>
      {% if (!i && !o.options.autoUpload) { %}
      <button class="btn btn-primary start" disabled>
        <i class="glyphicon glyphicon-upload"></i>
        <span>Start</span>
      </button>
      {% } %}
      {% if (!i) { %}
      <button class="btn btn-warning cancel">
        <i class="glyphicon glyphicon-ban-circle"></i>
        <span>Cancel</span>
      </button>
      {% } %}
    </td>
  </tr>
  {% } %}
</script>
<!-- The template to display files available for download -->
<script id="template-download" type="text/x-tmpl">
  {% for (var i=0, file; file=o.files[i]; i++) { %}
  <tr class="template-download fade">
    <td>
            <span class="preview">
                {% if (file.thumbnailUrl) { %}
                    <a href="{%=file.url%}" title="{%=file.name%}" download="{%=file.name%}" data-gallery><img src="{%=file.thumbnailUrl%}"></a>
                {% } %}
            </span>
    </td>
    <td>
      <p class="name">
        {% if (file.url) { %}
        <a href="{%=file.url%}" title="{%=file.name%}" download="{%=file.name%}" {%=file.thumbnailUrl?'data-gallery':''%}>{%=file.name%}</a>
        {% } else { %}
        <span>{%=file.name%}</span>
        {% } %}
      </p>
      {% if (file.error) { %}
      <div><span class="label label-danger">Error</span> {%=file.error%}</div>
      {% } %}
    </td>
    <td>
      <span class="size">{%=o.formatFileSize(file.size)%}</span>
    </td>
    <td>
      {% if (file.deleteUrl) { %}
      <button class="btn btn-danger delete" data-type="{%=file.deleteType%}" data-url="{%=file.deleteUrl%}"{% if (file.deleteWithCredentials) { %} data-xhr-fields='{"withCredentials":true}'{% } %}>
      <i class="glyphicon glyphicon-trash"></i>
      <span>Delete</span>
      </button>
      <%--<input type="checkbox" name="delete" value="1" class="toggle">--%>
      {% } else { %}
      <button class="btn btn-warning cancel">
        <i class="glyphicon glyphicon-ban-circle"></i>
        <span>Cancel</span>
      </button>
      {% } %}
    </td>
  </tr>
  {% } %}
</script>
<script src="/webjars/jquery/1.11.0/jquery.min.js"></script>
<!-- The jQuery UI widget factory, can be omitted if jQuery UI is already included -->
<!--<script src="/static/jQuery-File-Upload-9.5.7/js/vendor/jquery.ui.widget.js"></script>-->
<script src="/webjars/jquery-ui/1.9.0/js/jquery-ui-1.9.0.custom.min.js"></script>
<!-- The Templates plugin is included to render the upload/download listings -->
<script src="http://blueimp.github.io/JavaScript-Templates/js/tmpl.min.js"></script>
<!-- The Load Image plugin is included for the preview images and image resizing functionality -->
<script src="http://blueimp.github.io/JavaScript-Load-Image/js/load-image.min.js"></script>
<!-- The Canvas to Blob plugin is included for image resizing functionality -->
<script src="http://blueimp.github.io/JavaScript-Canvas-to-Blob/js/canvas-to-blob.min.js"></script>
<!-- Bootstrap JS is not required, but included for the responsive demo navigation -->
<script src="/webjars/bootstrap/3.2.0/js/bootstrap.min.js"></script>
<!-- blueimp Gallery script -->
<script src="http://blueimp.github.io/Gallery/js/jquery.blueimp-gallery.min.js"></script>
<!-- The Iframe Transport is required for browsers without support for XHR file uploads -->
<script src="/webjars/jquery-file-upload/9.5.7/js/jquery.iframe-transport.js"></script>
<!-- The basic File Upload plugin -->
<script src="/webjars/jquery-file-upload/9.5.7/js/jquery.fileupload.js"></script>
<!-- The File Upload processing plugin -->
<script src="/webjars/jquery-file-upload/9.5.7/js/jquery.fileupload-process.js"></script>
<!-- The File Upload image preview & resize plugin -->
<script src="/webjars/jquery-file-upload/9.5.7/js/jquery.fileupload-image.js"></script>
<!-- The File Upload audio preview plugin -->
<script src="/webjars/jquery-file-upload/9.5.7/js/jquery.fileupload-audio.js"></script>
<!-- The File Upload video preview plugin -->
<script src="/webjars/jquery-file-upload/9.5.7/js/jquery.fileupload-video.js"></script>
<!-- The File Upload validation plugin -->
<script src="/webjars/jquery-file-upload/9.5.7/js/jquery.fileupload-validate.js"></script>
<!-- The File Upload user interface plugin -->
<script src="/webjars/jquery-file-upload/9.5.7/js/jquery.fileupload-ui.js"></script>
<!-- The main application script -->
<script src="/static/main.js"></script>
<!-- The XDomainRequest Transport is included for cross-domain file deletion for IE 8 and IE 9 -->
<!--[if (gte IE 8)&(lt IE 10)]>
<script src="/webjars/jquery-file-upload/9.5.7/js/cors/jquery.xdr-transport.js"></script>
<![endif]-->

</body>
</html>