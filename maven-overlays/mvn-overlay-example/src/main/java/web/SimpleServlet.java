package com.upgradingdave.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.HttpRequestHandler;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class SimpleServlet implements HttpRequestHandler {

    final static Logger log = LoggerFactory.getLogger(SimpleServlet.class);

    @Override
    public void handleRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        request.setAttribute("NAME", "World");

        forward("index.jsp", request, response);

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
