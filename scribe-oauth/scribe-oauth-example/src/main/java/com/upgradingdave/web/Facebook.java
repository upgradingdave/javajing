package com.upgradingdave.web;

import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.FacebookApi;
import org.scribe.model.*;
import org.scribe.oauth.OAuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.HttpRequestHandler;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class Facebook implements HttpRequestHandler {

    final static Logger log = LoggerFactory.getLogger(Facebook.class);

    public final static String OAUTH_CODE = "code";
    public final static String OAUTH_TOKEN = "token";
    public final static String IS_AUTHENTICATED = "IS_AUTHENTICATED";

    private static final String PROTECTED_RESOURCE_URL = "https://graph.facebook.com/me";
    private static final Token EMPTY_TOKEN = null;

    private String apiSecret;
    private OAuthService service;

    public Facebook(String apiKey, String apiSecret, String callback) {

        this.apiSecret = apiSecret;

        service = new ServiceBuilder()
                .provider(FacebookApi.class)
                .apiKey(apiKey)
                .apiSecret(apiSecret)
                .callback(callback)
                .build();

    }

    @Override
    public void handleRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String token = request.getParameter(OAUTH_TOKEN);
        String code = request.getParameter(OAUTH_CODE);

        if(token != null && token.length() > 0) {

            log.debug("We have a valid oauth token! Make the facebook request");
            Token accessToken = new Token(token, apiSecret);
            doApiCall(accessToken, PROTECTED_RESOURCE_URL, response);
            return;

        } else if(code != null && code.length() > 0) {

            log.debug("We have a oauth code: {}.", code);
            log.debug("Attempting to verify the code...");

            Verifier verifier = new Verifier(code);

            log.debug("Trading the Request Token for an Access Token...");

            Token accessToken = service.getAccessToken(EMPTY_TOKEN, verifier);

            log.debug("Got the Access Token!");
            log.debug("(if your curious it looks like this: " + accessToken + " )");
            log.debug("Here's the secret: {}", accessToken.getSecret());

            request.setAttribute(OAUTH_TOKEN, accessToken.getToken());
            request.setAttribute(IS_AUTHENTICATED, true);

        } else {

            log.debug("We don't have auth code yet, fetching the Authorization URL...");
            String authorizationUrl = service.getAuthorizationUrl(EMPTY_TOKEN);
            log.debug("Redirecting to the Authorization URL: {}", authorizationUrl);

            request.setAttribute(IS_AUTHENTICATED, false);
            redirect(authorizationUrl, response);
            return;

        }

        forward("index.jsp", request, response);

    }

    public void doApiCall(Token accessToken, String fbResource, HttpServletResponse response) throws IOException {

        log.debug("Attempting request for fb resource {}", fbResource);

        OAuthRequest request = new OAuthRequest(Verb.GET, fbResource);
        service.signRequest(accessToken, request);
        Response apiResponse = request.send();

        response.setContentType("application/json");
        response.setStatus(apiResponse.getCode());
        response.getWriter().write(apiResponse.getBody());

    }

    private void redirect(String url, HttpServletResponse response) throws IOException {

        String urlWithSessionID = response.encodeRedirectURL(url);
        response.sendRedirect( urlWithSessionID );

    }

    public void forward(String path, HttpServletRequest request, HttpServletResponse response) throws ServletException {

        RequestDispatcher requestDispatcher = request.getRequestDispatcher(path);
        try {
            requestDispatcher.forward(request, response);
        } catch(Exception e) {
            log.error("Error forwarding request to {}", path, e);
            throw new ServletException(e);
        }
    }

}
