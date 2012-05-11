package com.upgradingdave;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

public class RubyExample {

    public static void main(String[] args){

        System.setProperty("org.jruby.embed.compat.version", "JRuby1.9");
        ScriptEngineManager factory = new ScriptEngineManager();

        ScriptEngine engine = factory.getEngineByName("jruby");

        try {
            engine.eval("require 'sass_helper'");

        } catch (ScriptException exception) {
            exception.printStackTrace();
        }
    }
}
