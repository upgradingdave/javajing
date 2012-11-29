<%@ page import="com.upgradingdave.web.Facebook" %>
<%@ page contentType="text/html;charset=UTF-8"%>
<%
    Boolean isAuthenticated = (Boolean) request.getAttribute(com.upgradingdave.web.Facebook.IS_AUTHENTICATED);
    String token = (String) request.getAttribute(com.upgradingdave.web.Facebook.OAUTH_TOKEN);
%>
<html>
  <head>
    <title>Welcome</title>
  </head>
  <body>

  <% if(isAuthenticated != null && isAuthenticated) { %>

  <div>
      <h3>You are now free to move about the cabin</h3>
      <a href="facebook?<%=com.upgradingdave.web.Facebook.OAUTH_TOKEN%>=<%=token%>">Get Your Fb User information</a>
  </div>

  <% } else { %>

  <a href="facebook">Authenticate with Facebook</a>

  <% } %>

  </body>
</html>
