<%@ page language="java" %>

<html>
  <head>
    <title>Set your Cookies</title>
  </head>
  <body>
  Cookie Test
  <%
      for(Cookie cookie : request.getCookies()) {
          if(cookie.getName().equals("javajing")) {
  %>
  <p>JavaJing Cookie is set to: <%=cookie.getValue()%></p>
  <%
          }
      }
  %>
  </body>
</html>
