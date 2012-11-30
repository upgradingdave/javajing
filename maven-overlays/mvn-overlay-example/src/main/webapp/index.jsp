<%@ page contentType="text/html;charset=UTF-8"%>
<%
    String name = (String) request.getAttribute("NAME");
%>
<!DOCTYPE html>
<html lang="en">
  <head>
      <title>Welcome</title>
      <link rel="stylesheet" type="text/css" href="static/bootstrap/css/bootstrap.css">
      <script type="text/javascript" src="static/bootstrap/js/bootstrap.min.js"></script>
  </head>
  <body>
  <div class="well">
      <h1>Hello, <%=name%>!</h1>
  </div>
  </body>
</html>
