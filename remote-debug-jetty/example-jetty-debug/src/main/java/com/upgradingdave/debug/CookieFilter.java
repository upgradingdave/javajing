package com.upgradingdave.debug;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;

import javax.servlet.*;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

public class CookieFilter implements Filter {

    final static String COOKIE_NAME = "javajing";
    final static String DATE_FORMAT = "yyyyMMdd HH:mm:ss Z";

    public Cookie findCookieByName(HttpServletRequest httpServletRequest, String cookieName) {
        for (Cookie nextCookie : httpServletRequest.getCookies()) {
            if(nextCookie.getName().equalsIgnoreCase(cookieName)) {
                return nextCookie;
            }
        }
        return null;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        Gson gson = new GsonBuilder().setDateFormat(DATE_FORMAT).create();

        Cookie cookie = findCookieByName(httpServletRequest, COOKIE_NAME);

        try {

            if(cookie != null) {

                //update cookie's value
                JavaJingCookie last = gson.fromJson(cookie.getValue(), JavaJingCookie.class);
                JavaJingCookie current = new JavaJingCookie(new Date(), last.getLastVisit());
                cookie.setValue(gson.toJson(current));

            } else {

                //create new cookie
                JavaJingCookie current = new JavaJingCookie(new Date(), new Date());
                cookie = new Cookie(COOKIE_NAME, gson.toJson(current));

            }

        } catch(JsonSyntaxException e) {

            if(cookie != null){
                //something went wrong, delete cookie
                cookie.setMaxAge(0);
            }

        } finally {

            if(cookie != null){
                cookie.setDomain("dev.javajing.com");
                cookie.setPath("/");
                cookie.setMaxAge(60*60);
                httpServletResponse.addCookie(cookie);
            }

            response.setContentType("text/html");
            chain.doFilter(request, response);
        }
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void destroy() {
    }

    public class JavaJingCookie {

        Date lastVisit;
        Date previousVisit;

        public JavaJingCookie(Date last, Date previous){
            lastVisit = last;
            previousVisit = previous;
        }

        public Date getLastVisit() {
            return lastVisit;
        }

    }

}
