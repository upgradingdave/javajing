/*!
Video.js - HTML5 Video Player
Version GENERATED_AT_BUILD

LGPL v3 LICENSE INFO
This file is part of Video.js. Copyright 2011 Zencoder, Inc.

Video.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Video.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with Video.js.  If not, see <http://www.gnu.org/licenses/>.
*/

// Self-executing function to prevent global vars and help with minification
;(((window, undefined) => {
  var document = window.document;// HTML5 Shiv. Must be in <head> to support older browsers.
  document.createElement("video");document.createElement("audio");

  var VideoJS = (id, addOptions, ready) => {
    var tag; // Element of ID

    // Allow for element or ID to be passed in
    // String ID
    if (typeof id == "string") {

      // Adjust for jQuery ID syntax
      if (id.indexOf("#") === 0) {
        id = id.slice(1);
      }

      // If a player instance has already been created for this ID return it.
      if (_V_.players[id]) {
        return _V_.players[id];

      // Otherwise get element for ID
      } else {
        tag = _V_.el(id)
      }

    // ID is a media element
    } else {
      tag = id;
    }

    // Check for a useable element
    if (!tag || !tag.nodeName) { // re: nodeName, could be a box div also
      throw new TypeError("The element or ID supplied is not valid. (VideoJS)"); // Returns
    }

    // Element may have a player attr referring to an already created player instance.
    // If not, set up a new player and return the instance.
    return tag.player || new _V_.Player(tag, addOptions, ready);
  };

  var // Shortcut
  _V_ = VideoJS;

  var // CDN Version. Used to target right flash swf.
  CDN_VERSION = "GENERATED_CDN_VSN";

  VideoJS.players = {};

  VideoJS.options = {

    // Default order of fallback technology
    techOrder: ["html5","flash"],
    // techOrder: ["flash","html5"],

    html5: {},
    flash: { swf: "http://vjs.zencdn.net/c/video-js.swf" },

    // Default of web browser is 300x150. Should rely on source width/height.
    width: 300,
    height: 150,

    // defaultVolume: 0.85,
    defaultVolume: 0.00, // The freakin seaguls are driving me crazy!

    // Included control sets
    components: {
      "posterImage": {},
      "textTrackDisplay": {},
      "loadingSpinner": {},
      "bigPlayButton": {},
      "controlBar": {}
    }

    // components: [
    //   "poster",
    //   "loadingSpinner",
    //   "bigPlayButton",
    //   { name: "controlBar", options: {
    //     components: [
    //       "playToggle",
    //       "fullscreenToggle",
    //       "currentTimeDisplay",
    //       "timeDivider",
    //       "durationDisplay",
    //       "remainingTimeDisplay",
    //       { name: "progressControl", options: {
    //         components: [
    //           { name: "seekBar", options: {
    //             components: [
    //               "loadProgressBar",
    //               "playProgressBar",
    //               "seekHandle"
    //             ]}
    //           }
    //         ]}
    //       },
    //       { name: "volumeControl", options: {
    //         components: [
    //           { name: "volumeBar", options: {
    //             components: [
    //               "volumeLevel",
    //               "volumeHandle"
    //             ]}
    //           }
    //         ]}
    //       },
    //       "muteToggle"
    //     ]
    //   }},
    //   "subtitlesDisplay"/*, "replay"*/
    // ]
  };

  // Set CDN Version of swf
  if (CDN_VERSION != "GENERATED_CDN_VSN") {
    _V_.options.flash.swf = "http://vjs.zencdn.net/"+CDN_VERSION+"/video-js.swf"
  }_V_.merge = (obj1, obj2, safe) => {
    // Make sure second object exists
    if (!obj2) { obj2 = {}; };

    for (var attrname in obj2){
      if (obj2.hasOwnProperty(attrname) && (!safe || !obj1.hasOwnProperty(attrname))) { obj1[attrname]=obj2[attrname]; }
    }
    return obj1;
  };
  _V_.extend = function(obj){ this.merge(this, obj, true); };

  _V_.extend({
    tech: {}, // Holder for playback technology settings
    controlSets: {}, // Holder for control set definitions

    // Device Checks
    isIE() { return !+"\v1"; },
    isFF() { return !!_V_.ua.match("Firefox") },
    isIPad() { return navigator.userAgent.match(/iPad/i) !== null; },
    isIPhone() { return navigator.userAgent.match(/iPhone/i) !== null; },
    isIOS() { return VideoJS.isIPhone() || VideoJS.isIPad(); },
    iOSVersion() {
      var match = navigator.userAgent.match(/OS (\d+)_/i);
      if (match && match[1]) { return match[1]; }
    },
    isAndroid() { return navigator.userAgent.match(/Android.*AppleWebKit/i) !== null; },
    androidVersion() {
      var match = navigator.userAgent.match(/Android (\d+)\./i);
      if (match && match[1]) { return match[1]; }
    },

    testVid: document.createElement("video"),
    ua: navigator.userAgent,
    support: {},

    each(arr, fn) {
      if (!arr || arr.length === 0) { return; }
      for (var i=0,j=arr.length; i<j; i++) {
        fn.call(this, arr[i], i);
      }
    },

    eachProp(obj, fn) {
      if (!obj) { return; }
      for (var name in obj) {
        if (obj.hasOwnProperty(name)) {
          fn.call(this, name, obj[name]);
        }
      }
    },

    el(id) { return document.getElementById(id); },
    createElement(tagName, attributes) {
      var el = document.createElement(tagName);
      var attrname;
      for (attrname in attributes){
        if (attributes.hasOwnProperty(attrname)) {
          if (attrname.indexOf("-") !== -1) {
            el.setAttribute(attrname, attributes[attrname]);
          } else {
            el[attrname] = attributes[attrname];
          }
        }
      }
      return el;
    },

    insertFirst(node, parent) {
      if (parent.firstChild) {
        parent.insertBefore(node, parent.firstChild);
      } else {
        parent.appendChild(node);
      }
    },

    addClass(element, classToAdd) {
      if ((" "+element.className+" ").indexOf(" "+classToAdd+" ") == -1) {
        element.className = element.className === "" ? classToAdd : element.className + " " + classToAdd;
      }
    },

    removeClass(element, classToRemove) {
      if (element.className.indexOf(classToRemove) == -1) { return; }
      var classNames = element.className.split(" ");
      classNames.splice(classNames.indexOf(classToRemove),1);
      element.className = classNames.join(" ");
    },

    // Attempt to block the ability to select text while dragging controls
    blockTextSelection() {
      document.body.focus();
      document.onselectstart = () => false;
    },
    // Turn off text selection blocking
    unblockTextSelection() { document.onselectstart = () => true; },

    // Return seconds as H:MM:SS or M:SS
    // Supplying a guide (in seconds) will include enough leading zeros to cover the length of the guide
    formatTime(seconds, guide) {
      guide = guide || seconds; // Default to using seconds as guide
      var s = Math.floor(seconds % 60);
      var m = Math.floor(seconds / 60 % 60);
      var h = Math.floor(seconds / 3600);
      var gm = Math.floor(guide / 60 % 60);
      var gh = Math.floor(guide / 3600);

      // Check if we need to show hours
      h = (h > 0 || gh > 0) ? h + ":" : "";

      // If hours are showing, we may need to add a leading zero.
      // Always show at least one digit of minutes.
      m = (((h || gm >= 10) && m < 10) ? "0" + m : m) + ":";

      // Check if leading zero is need for seconds
      s = (s < 10) ? "0" + s : s;

      return h + m + s;
    },

    uc(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    // Return the relative horizonal position of an event as a value from 0-1
    getRelativePosition(x, relativeElement) {
      return Math.max(0, Math.min(1, (x - _V_.findPosX(relativeElement)) / relativeElement.offsetWidth));
    },
    
    getComputedStyleValue(element, style) {
      return window.getComputedStyle(element, null).getPropertyValue(style);
    },

    trim(string) { return string.toString().replace(/^\s+/, "").replace(/\s+$/, ""); },
    round(num, dec) {
      if (!dec) { dec = 0; }
      return Math.round(num*(10 ** dec))/(10 ** dec);
    },

    isEmpty(object) {
      for (var prop in object) {
        return false;
      }
      return true;
    },

    // Mimic HTML5 TimeRange Spec.
    createTimeRange(start, end) {
      return {
        length: 1,
        start() { return start; },
        end() { return end; }
      };
    },

    /* Element Data Store. Allows for binding data to an element without putting it directly on the element.
       Ex. Event listneres are stored here.
       (also from jsninja.com)
    ================================================================================ */
    cache: {}, // Where the data is stored
    guid: 1, // Unique ID for the element
    expando: "vdata" + (new Date).getTime(), // Unique attribute to store element's guid in

    // Returns the cache object where data for the element is stored
    getData(elem) {
      var id = elem[_V_.expando];
      if (!id) {
        id = elem[_V_.expando] = _V_.guid++;
        _V_.cache[id] = {};
      }
      return _V_.cache[id];
    },
    // Delete data for the element from the cache and the guid attr from element
    removeData(elem) {
      var id = elem[_V_.expando];
      if (!id) { return; }
      // Remove all stored data
      delete _V_.cache[id];
      // Remove the expando property from the DOM node
      try {
        delete elem[_V_.expando];
      } catch(e) {
        if (elem.removeAttribute) {
          elem.removeAttribute(_V_.expando);
        } else {
          // IE doesn't appear to support removeAttribute on the document element
          elem[_V_.expando] = null;
        }
      }
    },

    /* Proxy (a.k.a Bind or Context). A simple method for changing the context of a function
       It also stores a unique id on the function so it can be easily removed from events
    ================================================================================ */
    proxy(context, fn, uid) {
      // Make sure the function has a unique ID
      if (!fn.guid) { fn.guid = _V_.guid++; }

      // Create the new function that changes the context
      var ret = function(...args) {
        return fn.apply(context, args);
      }

      // Allow for the ability to individualize this function
      // Needed in the case where multiple objects might share the same prototype
      // IF both items add an event listener with the same function, then you try to remove just one
      // it will remove both because they both have the same guid.
      // when using this, you need to use the proxy method when you remove the listener as well.
      ret.guid = (uid) ? uid + "_" + fn.guid : fn.guid;

      return ret;
    },

    get(url, onSuccess, onError) {
      // if (netscape.security.PrivilegeManager.enablePrivilege) {
      //   netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
      // }

      var local = (url.indexOf("file:") == 0 || (window.location.href.indexOf("file:") == 0 && url.indexOf("http:") == -1));

      if (typeof XMLHttpRequest == "undefined") {
        XMLHttpRequest = () => {
          try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e) {}
          try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (f) {}
          try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (g) {}
          throw new Error("This browser does not support XMLHttpRequest.");
        };
      }

      var request = new XMLHttpRequest();

      try {
        request.open("GET", url);
      } catch(e) {
        _V_.log("VideoJS XMLHttpRequest (open)", e);
        // onError(e);
        return false;
      }

      request.onreadystatechange = _V_.proxy(this, () => {
        if (request.readyState == 4) {
          if (request.status == 200 || local && request.status == 0) {
            onSuccess(request.responseText);
          } else {
            if (onError) {
              onError();
            }
          }
        }
      });

      try {
        request.send();
      } catch(e) {
        _V_.log("VideoJS XMLHttpRequest (send)", e);
        if (onError) {
          onError(e);
        }
      }
    },

    /* Local Storage
    ================================================================================ */
    setLocalStorage(key, value) {
      // IE was throwing errors referencing the var anywhere without this
      var localStorage = window.localStorage || false;
      if (!localStorage) { return; }
      try {
        localStorage[key] = value;
      } catch(e) {
        if (e.code == 22 || e.code == 1014) { // Webkit == 22 / Firefox == 1014
          _V_.log("LocalStorage Full (VideoJS)", e);
        } else {
          _V_.log("LocalStorage Error (VideoJS)", e);
        }
      }
    },

    // Get abosolute version of relative URL. Used to tell flash correct URL.
    // http://stackoverflow.com/questions/470832/getting-an-absolute-url-from-a-relative-one-ie6-issue
    getAbsoluteURL(url) {

      // Check if absolute URL
      if (!url.match(/^https?:\/\//)) {
        // Convert to absolute URL. Flash hosted off-site needs an absolute URL.
        url = _V_.createElement('div', {
          innerHTML: '<a href="'+url+'">x</a>'
        }).firstChild.href;
      }

      return url;
    }

  });

  // usage: log('inside coolFunc', this, arguments);
  // paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
  _V_.log = function(...args) {
    _V_.log.history = _V_.log.history || [];// store logs to an array for reference
    _V_.log.history.push(args);
    if(window.console) {
      args.callee = args.callee.caller;
      var newarr = [].slice.call(args);
      (typeof console.log === 'object' ? _V_.log.apply.call(console.log, console, newarr) : console.log(...newarr));
    }
  };

  // make it safe to use console.log always
  ((b => {function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}}))(((() => {try
  {console.log();return window.console;}catch(err){return window.console={};}}))());

  // Offset Left
  // getBoundingClientRect technique from John Resig http://ejohn.org/blog/getboundingclientrect-is-awesome/
  if ("getBoundingClientRect" in document.documentElement) {
    _V_.findPosX = el => {
      var box;

      try {
        box = el.getBoundingClientRect();
      } catch(e) {}

      if (!box) { return 0; }

      var docEl = document.documentElement;
      var body = document.body;
      var clientLeft = docEl.clientLeft || body.clientLeft || 0;
      var scrollLeft = window.pageXOffset || body.scrollLeft;
      var left = box.left + scrollLeft - clientLeft;

      return left;
    };
  } else {
    _V_.findPosX = el => {
      var curleft = el.offsetLeft;
      // _V_.log(obj.className, obj.offsetLeft)
      while(el = obj.offsetParent) {
        if (el.className.indexOf("video-js") == -1) {
          // _V_.log(el.offsetParent, "OFFSETLEFT", el.offsetLeft)
          // _V_.log("-webkit-full-screen", el.webkitMatchesSelector("-webkit-full-screen"));
          // _V_.log("-webkit-full-screen", el.querySelectorAll(".video-js:-webkit-full-screen"));
        } else {
        }
        curleft += el.offsetLeft;
      }
      return curleft;
    };
  }// Javascript JSON implementation
  // (Parse Method Only)
  // https://github.com/douglascrockford/JSON-js/blob/master/json2.js

  var JSON;
  if (!JSON) { JSON = {}; }

  ((() => {
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    if (typeof JSON.parse !== 'function') {
        JSON.parse = (text, reviver) => {
            var j;

            function walk(holder, key) {
              var k;
              var v;
              var value = holder[key];
              if (value && typeof value === 'object') {
                  for (k in value) {
                      if (Object.prototype.hasOwnProperty.call(value, k)) {
                          v = walk(value, k);
                          if (v !== undefined) {
                              value[k] = v;
                          } else {
                              delete value[k];
                          }
                      }
                  }
              }
              return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, a => '\\u' +
                    ('0000' + a.charCodeAt(0).toString(16)).slice(-4));
            }

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                j = eval('(' + text + ')');

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

            throw new SyntaxError('JSON.parse');
        };
    }
  })());
  // Event System (J.Resig - Secrets of a JS Ninja http://jsninja.com/ [Go read it, really])
  // (Book version isn't completely usable, so fixed some things and borrowed from jQuery where it's working)
  // 
  // This should work very similarly to jQuery's events, however it's based off the book version which isn't as
  // robust as jquery's, so there's probably some differences.
  // 
  // When you add an event listener using _V_.addEvent, 
  //   it stores the handler function in seperate cache object, 
  //   and adds a generic handler to the element's event,
  //   along with a unique id (guid) to the element.

  _V_.extend({

    // Add an event listener to element
    // It stores the handler function in a separate cache object
    // and adds a generic handler to the element's event,
    // along with a unique id (guid) to the element.
    on(elem, type, fn) {
      var data = _V_.getData(elem);
      var handlers;

      // We only need to generate one handler per element
      if (data && !data.handler) {
        // Our new meta-handler that fixes the event object and the context
        data.handler = event => {
          event = _V_.fixEvent(event);
          var handlers = _V_.getData(elem).events[event.type];
          // Go through and call all the real bound handlers
          if (handlers) {
            
            // Copy handlers so if handlers are added/removed during the process it doesn't throw everything off.
            var handlersCopy = [];
            _V_.each(handlers, (handler, i) => {
              handlersCopy[i] = handler;
            })
            
            for (var i = 0, l = handlersCopy.length; i < l; i++) {
              handlersCopy[i].call(elem, event);
            }
          }
        };
      }

      // We need a place to store all our event data
      if (!data.events) { data.events = {}; }

      // And a place to store the handlers for this event type
      handlers = data.events[type];

      if (!handlers) {
        handlers = data.events[ type ] = [];

        // Attach our meta-handler to the element, since one doesn't exist
        if (document.addEventListener) {
          elem.addEventListener(type, data.handler, false);
        } else if (document.attachEvent) {
          elem.attachEvent("on" + type, data.handler);
        }
      }

      if (!fn.guid) { fn.guid = _V_.guid++; }

      handlers.push(fn);
    },
    // Deprecated name for 'on' function
    addEvent(...args) { return _V_.on.apply(this, args); },

    off(elem, type, fn) {
      var data = _V_.getData(elem);
      var handlers;
      // If no events exist, nothing to unbind
      if (!data.events) { return; }

      // Are we removing all bound events?
      if (!type) {
        for (type in data.events) {
          _V_.cleanUpEvents(elem, type);
        }
        return;
      }

      // And a place to store the handlers for this event type
      handlers = data.events[type];

      // If no handlers exist, nothing to unbind
      if (!handlers) { return; }

      // See if we're only removing a single handler
      if (fn && fn.guid) {
        for (var i = 0; i < handlers.length; i++) {
          // We found a match (don't stop here, there could be a couple bound)
          if (handlers[i].guid === fn.guid) {
            // Remove the handler from the array of handlers
            handlers.splice(i--, 1);
          }
        }
      }

      _V_.cleanUpEvents(elem, type);
    },
    // Deprecated name for 'on' function
    removeEvent(...args) { return _V_.off.apply(this, args); },

    cleanUpEvents(elem, type) {
      var data = _V_.getData(elem);
      // Remove the events of a particular type if there are none left

      if (data.events[type].length === 0) {
        delete data.events[type];

        // Remove the meta-handler from the element
        if (document.removeEventListener) {
          elem.removeEventListener(type, data.handler, false);
        } else if (document.detachEvent) {
          elem.detachEvent("on" + type, data.handler);
        }
      }

      // Remove the events object if there are no types left
      if (_V_.isEmpty(data.events)) {
        delete data.events;
        delete data.handler;
      }

      // Finally remove the expando if there is no data left
      if (_V_.isEmpty(data)) {
        _V_.removeData(elem);
      }
    },

    fixEvent(event) {
      if (event[_V_.expando]) { return event; }
      // store a copy of the original event object
      // and "clone" to set read-only properties
      var originalEvent = event;
      event = new _V_.Event(originalEvent);

      for ( var i = _V_.Event.props.length, prop; i; ) {
        prop = _V_.Event.props[ --i ];
        event[prop] = originalEvent[prop];
      }

      // Fix target property, if necessary
      if (!event.target) { event.target = event.srcElement || document; }

      // check if target is a textnode (safari)
      if (event.target.nodeType === 3) { event.target = event.target.parentNode; }

      // Add relatedTarget, if necessary
      if (!event.relatedTarget && event.fromElement) {
        event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
      }

      // Calculate pageX/Y if missing and clientX/Y available
      if ( event.pageX == null && event.clientX != null ) {
        var eventDocument = event.target.ownerDocument || document;
        var doc = eventDocument.documentElement;
        var body = eventDocument.body;

        event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
      }

      // Add which for key events
      if (event.which == null && (event.charCode != null || event.keyCode != null)) {
        event.which = event.charCode != null ? event.charCode : event.keyCode;
      }

      // Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
      if ( !event.metaKey && event.ctrlKey ) {
        event.metaKey = event.ctrlKey;
      }

      // Add which for click: 1 === left; 2 === middle; 3 === right
      // Note: button is not normalized, so don't use it
      if ( !event.which && event.button !== undefined ) {
        event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
      }

      return event;
    },

    trigger(elem, event) {
      var data = _V_.getData(elem);
      var parent = elem.parentNode || elem.ownerDocument;
      var type = event.type || event;
      var handler;

      if (data) { handler = data.handler }

      // Added in attion to book. Book code was broke.
      event = typeof event === "object" ?
        event[_V_.expando] ? 
          event :
          new _V_.Event(type, event) :
        new _V_.Event(type);

      event.type = type;
      if (handler) {
        handler.call(elem, event);
      }

      // Clean up the event in case it is being reused
      event.result = undefined;
      event.target = elem;

      // Bubble the event up the tree to the document,
      // Unless it's been explicitly stopped
      // if (parent && !event.isPropagationStopped()) {
      //   _V_.triggerEvent(parent, event);
      // 
      // // We're at the top document so trigger the default action
      // } else if (!parent && !event.isDefaultPrevented()) {
      //   // log(type);
      //   var targetData = _V_.getData(event.target);
      //   // log(targetData);
      //   var targetHandler = targetData.handler;
      //   // log("2");
      //   if (event.target[event.type]) {
      //     // Temporarily disable the bound handler,
      //     // don't want to execute it twice
      //     if (targetHandler) {
      //       targetData.handler = function(){};
      //     }
      // 
      //     // Trigger the native event (click, focus, blur)
      //     event.target[event.type]();
      // 
      //     // Restore the handler
      //     if (targetHandler) {
      //       targetData.handler = targetHandler;
      //     }
      //   }
      // }
    },
    // Deprecated name for 'on' function
    triggerEvent(...args) { return _V_.trigger.apply(this, args); },

    one(elem, type, fn) {
      _V_.on(elem, type, function(...args) {
        _V_.off(elem, type, args.callee)
        fn.apply(this, args);
      });
    }
  });

  // Custom Event object for standardizing event objects between browsers.
  _V_.Event = function(src, props){
    // Event object
    if (src && src.type) {
      this.originalEvent = src;
      this.type = src.type;

      // Events bubbling up the document may have been marked as prevented
      // by a handler lower down the tree; reflect the correct value.
      this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
        src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

    // Event type
    } else {
      this.type = src;
    }

    // Put explicitly provided properties onto the event object
    if (props) { _V_.merge(this, props); }

    this.timeStamp = (new Date).getTime();

    // Mark it as fixed
    this[_V_.expando] = true;
  };

  _V_.Event.prototype = {
    preventDefault() {
      this.isDefaultPrevented = returnTrue;

      var e = this.originalEvent;
      if (!e) { return; }

      // if preventDefault exists run it on the original event
      if (e.preventDefault) { 
        e.preventDefault();
      // otherwise set the returnValue property of the original event to false (IE)
      } else {
        e.returnValue = false;
      }
    },
    stopPropagation() {
      this.isPropagationStopped = returnTrue;

      var e = this.originalEvent;
      if (!e) { return; }
      // if stopPropagation exists run it on the original event
      if (e.stopPropagation) { e.stopPropagation(); }
      // otherwise set the cancelBubble property of the original event to true (IE)
      e.cancelBubble = true;
    },
    stopImmediatePropagation() {
      this.isImmediatePropagationStopped = returnTrue;
      this.stopPropagation();
    },
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse
  };
  _V_.Event.props = "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" ");

  function returnTrue(){ return true; }
  function returnFalse(){ return false; }

  // Using John Resig's Class implementation http://ejohn.org/blog/simple-javascript-inheritance/
  // (function(){var initializing=false, fnTest=/xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/; _V_.Class = function(){}; _V_.Class.extend = function(prop) { var _super = this.prototype; initializing = true; var prototype = new this(); initializing = false; for (var name in prop) { prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function(name, fn){ return function() { var tmp = this._super; this._super = _super[name]; var ret = fn.apply(this, arguments); this._super = tmp; return ret; }; })(name, prop[name]) : prop[name]; } function Class() { if ( !initializing && this.init ) this.init.apply(this, arguments); } Class.prototype = prototype; Class.constructor = Class; Class.extend = arguments.callee; return Class;};})();
  ((() => {
    var initializing = false;
    var fnTest = /xyz/.test(() => {xyz;}) ? /\b_super\b/ : /.*/;
    _V_.Class = () => {};
    _V_.Class.extend = function(prop) {
      var _super = this.prototype;
      initializing = true;
      var prototype = new this();
      initializing = false;
      for (var name in prop) {
        prototype[name] = typeof prop[name] == "function" &&
          typeof _super[name] == "function" && fnTest.test(prop[name]) ?
          (((name, fn) => function(...args) {
            var tmp = this._super;
            this._super = _super[name];
            var ret = fn.apply(this, args);
            this._super = tmp;
            return ret;
          }))(name, prop[name]) :
          prop[name];
      }
      function Class(...args) {
        if ( !initializing && this.init ) {
          return this.init(...args);

        // Attempting to recreate accessing function form of class.
        } else if (!initializing) {
          return args.callee.prototype.init();
        }
      }
      Class.prototype = prototype;
      Class.constructor = Class;
      Class.extend = arguments.callee;
      return Class;
    };
  }))();

  /* Player Component- Base class for all UI objects
  ================================================================================ */
  _V_.Component = _V_.Class.extend({

    init(player, options) {
      this.player = player;

      // Allow for overridding default component options
      options = this.options = _V_.merge(this.options || {}, options);

      // Create element if one wasn't provided in options
      if (options.el) {
        this.el = options.el;
      } else {
        this.el = this.createElement();
      }

      // Add any components in options
      this.initComponents();
    },

    destroy() {},

    createElement(type, attrs) {
      return _V_.createElement(type || "div", attrs);
    },

    buildCSSClass() {
      // Child classes can include a function that does:
      // return "CLASS NAME" + this._super();
      return "";
    },

    initComponents() {
      var options = this.options;
      if (options && options.components) {
        // Loop through components and add them to the player
        this.eachProp(options.components, function(name, opts){

          // Allow waiting to add components until a specific event is called
          var tempAdd = this.proxy(function(){
            // Set property name on player. Could cause conflicts with other prop names, but it's worth making refs easy.
            this[name] = this.addComponent(name, opts);
          });

          if (opts.loadEvent) {
            this.one(opts.loadEvent, tempAdd)
          } else {
            tempAdd();
          }
        });
      }
    },

    // Add child components to this component.
    // Will generate a new child component and then append child component's element to this component's element.
    // Takes either the name of the UI component class, or an object that contains a name, UI Class, and options.
    addComponent(name, options) {
      var component;
      var componentClass;

      // If string, create new component with options
      if (typeof name == "string") {

        // Make sure options is at least an empty object to protect against errors
        options = options || {};

        // Assume name of set is a lowercased name of the UI Class (PlayButton, etc.)
        componentClass = options.componentClass || _V_.uc(name);

        // Create a new object & element for this controls set
        // If there's no .player, this is a player
        component = new _V_[componentClass](this.player || this, options);

      } else {
        component = name;
      }

      // Add the UI object's element to the container div (box)
      this.el.appendChild(component.el);

      // Return so it can stored on parent object if desired.
      return component;
    },

    removeComponent(component) {
      this.el.removeChild(component.el);
    },

    /* Display
    ================================================================================ */
    show() {
      this.el.style.display = "block";
    },

    hide() {
      this.el.style.display = "none";
    },
    
    fadeIn() {
      this.removeClass("vjs-fade-out");
      this.addClass("vjs-fade-in");
    },

    fadeOut() {
      this.removeClass("vjs-fade-in");
      this.addClass("vjs-fade-out");
    },

    lockShowing() {
      var style = this.el.style;
      style.display = "block";
      style.opacity = 1;
      style.visiblity = "visible";
    },

    unlockShowing() {
      var style = this.el.style;
      style.display = "";
      style.opacity = "";
      style.visiblity = "";
    },

    addClass(classToAdd) {
      _V_.addClass(this.el, classToAdd);
    },

    removeClass(classToRemove) {
      _V_.removeClass(this.el, classToRemove);
    },

    /* Events
    ================================================================================ */
    on(type, fn, uid) {
      _V_.on(this.el, type, _V_.proxy(this, fn));
      return this;
    },
    // Deprecated name for 'on' function
    addEvent(...args) { return this.on(...args); },

    off(type, fn) {
      _V_.off(this.el, type, fn);
      return this;
    },
    // Deprecated name for 'off' function
    removeEvent(...args) { return this.off(...args); },

    trigger(type, e) {
      _V_.trigger(this.el, type, e);
      return this;
    },
    // Deprecated name for 'off' function
    triggerEvent(...args) { return this.trigger(...args); },

    one(type, fn) {
      _V_.one(this.el, type, _V_.proxy(this, fn));
      return this;
    },

    /* Ready - Trigger functions when component is ready
    ================================================================================ */
    ready(fn) {
      if (!fn) return this;

      if (this.isReady) {
        fn.call(this);
      } else {
        if (this.readyQueue === undefined) {
          this.readyQueue = [];
        }
        this.readyQueue.push(fn);
      }

      return this;
    },

    triggerReady() {
      this.isReady = true;
      if (this.readyQueue && this.readyQueue.length > 0) {
        // Call all functions in ready queue
        this.each(this.readyQueue, function(fn){
          fn.call(this);
        });

        // Reset Ready Queue
        this.readyQueue = [];

        // Allow for using event listeners also, in case you want to do something everytime a source is ready.
        this.trigger("ready");
      }
    },

    /* Utility
    ================================================================================ */
    each(arr, fn) { _V_.each.call(this, arr, fn); },

    eachProp(obj, fn) { _V_.eachProp.call(this, obj, fn); },

    extend(obj) { _V_.merge(this, obj) },

    // More easily attach 'this' to functions
    proxy(fn, uid) {  return _V_.proxy(this, fn, uid); }

  });/* UI Component- Base class for all UI objects
================================================================================ */
  _V_.Player = _V_.Component.extend({

    init(tag, addOptions, ready) {
      this.tag = tag; // Store the original tag used to set options

      var // Div to contain video and controls
      el = this.el = _V_.createElement("div");

      var options = this.options = {};

      // Set Options
      _V_.merge(options, _V_.options); // Copy Global Defaults
      _V_.merge(options, this.getVideoTagSettings()); // Override with Video Tag Options
      _V_.merge(options, addOptions); // Override/extend with options from setup call

      // Add callback to ready queue
      this.ready(ready);

      // Store controls setting, and then remove immediately so native controls don't flash.
      tag.removeAttribute("controls");

      // Poster will be handled by a manual <img>
      tag.removeAttribute("poster");

      // Make player findable on elements
      tag.player = el.player = this;

      // Make sure tag ID exists
      tag.id = tag.id || "vjs_video_" + _V_.guid++;

      // Give video tag properties to box
      // ID will now reference box, not the video tag
      this.id = el.id = tag.id;
      el.className = tag.className;

      // Make player easily findable by ID
      _V_.players[el.id] = this;

      // Make box use width/height of tag, or default 300x150
      // Enforce with CSS since width/height attrs don't work on divs
      this.width(options.width, true); // (true) Skip resize listener on load
      this.height(options.height, true);

      // Update tag id/class for use as HTML5 playback tech
      // Might think we should do this after embedding in container so .vjs-tech class 
      // doesn't flash 100% width/height, but class only applies with .video-js parent
      tag.id += "_html5_api";
      tag.className = "vjs-tech";

      // Remove width/height attrs from tag so CSS can make it 100% width/height
      tag.removeAttribute("width");
      tag.removeAttribute("height");

      // Wrap video tag in div (el/box) container
      tag.parentNode.insertBefore(el, tag);
      el.appendChild(tag); // Breaks iPhone, fixed in HTML5 setup.

      // Empty video tag sources and tracks so the built-in player doesn't use them also.
      if (tag.hasChildNodes()) {
        var nrOfChildNodes = tag.childNodes.length;
        for (var i=0,j=tag.childNodes;i<nrOfChildNodes;i++) {
          if (j[0].nodeName.toLowerCase() == "source" || j[0].nodeName.toLowerCase() == "track") {
            tag.removeChild(j[0]);
          }
        }
      }

      // Cache for video property values.
      this.values = {};

      this.addClass("vjs-paused");

      this.on("ended", this.onEnded);
      this.on("play", this.onPlay);
      this.on("pause", this.onPause);
      this.on("progress", this.onProgress);
      this.on("durationchange", this.onDurationChange);
      this.on("error", this.onError);

      // When the API is ready, loop through the components and add to the player.
      if (options.controls) {
        this.ready(function(){
          this.initComponents();
        });
      }

      // Tracks defined in tracks.js
      this.textTracks = [];
      if (options.tracks && options.tracks.length > 0) {
        this.addTextTracks(options.tracks);
      }

      // If there are no sources when the player is initialized,
      // load the first supported playback technology.
      if (!options.sources || options.sources.length == 0) {
        for (var i=0,j=options.techOrder; i<j.length; i++) {
          var techName = j[i];
          var tech = _V_[techName];

          // Check if the browser supports this technology
          if (tech.isSupported()) {
            this.loadTech(techName);
            break;
          }
        }
      } else {
        // Loop through playback technologies (HTML5, Flash) and check for support. Then load the best source.
        // A few assumptions here:
        //   All playback technologies respect preload false.
        this.src(options.sources);
      }
    },

    destroy() {
      // Ensure that tracking progress and time progress will stop and plater deleted
      this.stopTrackingProgress();
      this.stopTrackingCurrentTime();
      _V_.players[this.id] = null;
      delete _V_.players[this.id];
      this.tech.destroy();
      this.el.parentNode.removeChild(this.el);
    },

    createElement(type, options) {},

    getVideoTagSettings() {
      var options = {
        sources: [],
        tracks: []
      }; // For better minification

      var tag = this.tag;
      var getAttribute = "getAttribute";

      options.src = tag[getAttribute]("src");
      options.controls = tag[getAttribute]("controls") !== null;
      options.poster = tag[getAttribute]("poster");
      options.preload = tag[getAttribute]("preload");
      options.autoplay = tag[getAttribute]("autoplay") !== null; // hasAttribute not IE <8 compatible
      options.loop = tag[getAttribute]("loop") !== null;
      options.muted = tag[getAttribute]("muted") !== null;

      options.width = tag[getAttribute]("width");
      options.height = tag[getAttribute]("height");

      if (this.tag.hasChildNodes()) {
        for (var c,i=0,j=this.tag.childNodes;i<j.length;i++) {
          c = j[i];
          if (c.nodeName.toLowerCase() == "source") {
            options.sources.push({
              src: c[getAttribute]('src'),
              type: c[getAttribute]('type'),
              media: c[getAttribute]('media'),
              title: c[getAttribute]('title')
            });
          }
          if (c.nodeName.toLowerCase() == "track") {
            options.tracks.push({
              src: c[getAttribute]("src"),
              kind: c[getAttribute]("kind"),
              srclang: c[getAttribute]("srclang"),
              label: c[getAttribute]("label"),
              'default': c[getAttribute]("default") !== null,
              title: c[getAttribute]("title")
            });
          }
        }
      }
      return options;
    },

    /* PLayback Technology (tech)
    ================================================================================ */
    // Load/Create an instance of playback technlogy including element and API methods
    // And append playback element in player div.
    loadTech(techName, source) {

      // Pause and remove current playback technology
      if (this.tech) {
        this.unloadTech();

      // If the first time loading, HTML5 tag will exist but won't be initialized
      // So we need to remove it if we're not loading HTML5
      } else if (techName != "html5" && this.tag) {
        this.el.removeChild(this.tag);
        this.tag = false;
      }

      this.techName = techName;

      // Turn off API access because we're loading a new tech that might load asynchronously
      this.isReady = false;

      var techReady = function(){
        this.player.triggerReady();

        // Manually track progress in cases where the browser/flash player doesn't report it.
        if (!this.support.progressEvent) {
          this.player.manualProgressOn();
        }

        // Manually track timeudpates in cases where the browser/flash player doesn't report it.
        if (!this.support.timeupdateEvent) {
          this.player.manualTimeUpdatesOn();
        }
      }

      // Grab tech-specific options from player options and add source and parent element to use.
      var techOptions = _V_.merge({ source, parentEl: this.el }, this.options[techName])

      if (source) {
        if (source.src == this.values.src && this.values.currentTime > 0) {
          techOptions.startTime = this.values.currentTime;
        }

        this.values.src = source.src;
      }

      // Initialize tech instance
      this.tech = new _V_[techName](this, techOptions);
      this.tech.ready(techReady);
    },

    unloadTech() {
      this.tech.destroy();

      // Turn off any manual progress or timeupdate tracking
      if (this.manualProgress) { this.manualProgressOff(); }

      if (this.manualTimeUpdates) { this.manualTimeUpdatesOff(); }

      this.tech = false;
    },

    // There's many issues around changing the size of a Flash (or other plugin) object.
    // First is a plugin reload issue in Firefox that has been around for 11 years: https://bugzilla.mozilla.org/show_bug.cgi?id=90268
    // Then with the new fullscreen API, Mozilla and webkit browsers will reload the flash object after going to fullscreen.
    // To get around this, we're unloading the tech, caching source and currentTime values, and reloading the tech once the plugin is resized.
    // reloadTech: function(betweenFn){
    //   _V_.log("unloadingTech")
    //   this.unloadTech();
    //   _V_.log("unloadedTech")
    //   if (betweenFn) { betweenFn.call(); }
    //   _V_.log("LoadingTech")
    //   this.loadTech(this.techName, { src: this.values.src })
    //   _V_.log("loadedTech")
    // },

    /* Fallbacks for unsupported event types
    ================================================================================ */
    // Manually trigger progress events based on changes to the buffered amount
    // Many flash players and older HTML5 browsers don't send progress or progress-like events
    manualProgressOn() {
      this.manualProgress = true;

      // Trigger progress watching when a source begins loading
      this.trackProgress();

      // Watch for a native progress event call on the tech element
      // In HTML5, some older versions don't support the progress event
      // So we're assuming they don't, and turning off manual progress if they do.
      this.tech.on("progress", function(...args) {

        // Remove this listener from the element
        this.removeEvent("progress", args.callee);

        // Update known progress support for this playback technology
        this.support.progressEvent = true;

        // Turn off manual progress tracking
        this.player.manualProgressOff();
      });
    },

    manualProgressOff() {
      this.manualProgress = false;
      this.stopTrackingProgress();
    },

    trackProgress() {
      this.progressInterval = setInterval(_V_.proxy(this, function(){
        // Don't trigger unless buffered amount is greater than last time
        // log(this.values.bufferEnd, this.buffered().end(0), this.duration())
        /* TODO: update for multiple buffered regions */
        if (this.values.bufferEnd < this.buffered().end(0)) {
          this.trigger("progress");
        } else if (this.bufferedPercent() == 1) {
          this.stopTrackingProgress();
          this.trigger("progress"); // Last update
        }
      }), 500);
    },
    stopTrackingProgress() { clearInterval(this.progressInterval); },

    /* Time Tracking -------------------------------------------------------------- */
    manualTimeUpdatesOn() {
      this.manualTimeUpdates = true;

      this.on("play", this.trackCurrentTime);
      this.on("pause", this.stopTrackingCurrentTime);
      // timeupdate is also called by .currentTime whenever current time is set

      // Watch for native timeupdate event
      this.tech.on("timeupdate", function(...args) {

        // Remove this listener from the element
        this.removeEvent("timeupdate", args.callee);

        // Update known progress support for this playback technology
        this.support.timeupdateEvent = true;

        // Turn off manual progress tracking
        this.player.manualTimeUpdatesOff();
      });
    },

    manualTimeUpdatesOff() {
      this.manualTimeUpdates = false;
      this.stopTrackingCurrentTime();
      this.removeEvent("play", this.trackCurrentTime);
      this.removeEvent("pause", this.stopTrackingCurrentTime);
    },

    trackCurrentTime() {
      if (this.currentTimeInterval) { this.stopTrackingCurrentTime(); }
      this.currentTimeInterval = setInterval(_V_.proxy(this, function(){
        this.trigger("timeupdate");
      }), 250); // 42 = 24 fps // 250 is what Webkit uses // FF uses 15
    },

    // Turn off play progress tracking (when paused or dragging)
    stopTrackingCurrentTime() { clearInterval(this.currentTimeInterval); },

    /* Player event handlers (how the player reacts to certain events)
    ================================================================================ */
    onEnded() {
      if (this.options.loop) {
        this.currentTime(0);
        this.play();
      } else {
        this.pause();
      }
    },

    onPlay() {
      _V_.removeClass(this.el, "vjs-paused");
      _V_.addClass(this.el, "vjs-playing");
    },

    onPause() {
      _V_.removeClass(this.el, "vjs-playing");
      _V_.addClass(this.el, "vjs-paused");
    },

    onProgress() {
      // Add custom event for when source is finished downloading.
      if (this.bufferedPercent() == 1) {
        this.trigger("loadedalldata");
      }
    },

    // Update duration with durationchange event
    // Allows for cacheing value instead of asking player each time.
    onDurationChange() {
      this.duration(this.techGet("duration"));
    },

    onError(e) {
      _V_.log("Video Error", e);
    },

  /* Player API
  ================================================================================ */

    // Pass values to the playback tech
    techCall(method, arg) {

      // If it's not ready yet, call method when it is
      if (!this.tech.isReady) {
        this.tech.ready(function(){
          this[method](arg);
        });

      // Otherwise call method now
      } else {
        try {
          this.tech[method](arg);
        } catch(e) {
          _V_.log(e);
        }
      }
    },

    // Get calls can't wait for the tech, and sometimes don't need to.
    techGet(method) {

      // Make sure tech is ready
      if (this.tech.isReady) {

        // Flash likes to die and reload when you hide or reposition it.
        // In these cases the object methods go away and we get errors.
        // When that happens we'll catch the errors and inform tech that it's not ready any more.
        try {
          return this.tech[method]();
        } catch(e) {

          // When building additional tech libs, an expected method may not be defined yet
          if (this.tech[method] === undefined) {
            _V_.log("Video.js: " + method + " method not defined for "+this.techName+" playback technology.", e);

          } else {

            // When a method isn't available on the object it throws a TypeError
            if (e.name == "TypeError") {
              _V_.log("Video.js: " + method + " unavailable on "+this.techName+" playback technology element.", e);
              this.tech.isReady = false;

            } else {
              _V_.log(e);
            }
          }
        }
      }

      return;
    },

    // Method for calling methods on the current playback technology
    // techCall: function(method, arg){
    // 
    //   // if (this.isReady) {
    //   //   
    //   // } else {
    //   //   _V_.log("The playback technology API is not ready yet. Use player.ready(myFunction)."+" ["+method+"]", arguments.callee.caller.arguments.callee.caller.arguments.callee.caller)
    //   //   return false;
    //   //   // throw new Error("The playback technology API is not ready yet. Use player.ready(myFunction)."+" ["+method+"]");
    //   // }
    // },

    // http://dev.w3.org/html5/spec/video.html#dom-media-play
    play() {
      this.techCall("play");
      return this;
    },

    // http://dev.w3.org/html5/spec/video.html#dom-media-pause
    pause() {
      this.techCall("pause");
      return this;
    },
    
    // http://dev.w3.org/html5/spec/video.html#dom-media-paused
    // The initial state of paused should be true (in Safari it's actually false)
    paused() {
      return (this.techGet("paused") === false) ? false : true;
    },

    // http://dev.w3.org/html5/spec/video.html#dom-media-currenttime
    currentTime(seconds) {
      if (seconds !== undefined) {

        // Cache the last set value for smoother scrubbing.
        this.values.lastSetCurrentTime = seconds;

        this.techCall("setCurrentTime", seconds);

        // Improve the accuracy of manual timeupdates
        if (this.manualTimeUpdates) { this.trigger("timeupdate"); }

        return this;
      }

      // Cache last currentTime and return
      // Default to 0 seconds
      return this.values.currentTime = (this.techGet("currentTime") || 0);
    },

    // http://dev.w3.org/html5/spec/video.html#dom-media-duration
    // Duration should return NaN if not available. ParseFloat will turn false-ish values to NaN.
    duration(seconds) {
      if (seconds !== undefined) {

        // Cache the last set value for optimiized scrubbing (esp. Flash)
        this.values.duration = parseFloat(seconds);

        return this;
      }

      return this.values.duration;
    },

    // Calculates how much time is left. Not in spec, but useful.
    remainingTime() {
      return this.duration() - this.currentTime();
    },

    // http://dev.w3.org/html5/spec/video.html#dom-media-buffered
    // Buffered returns a timerange object. Kind of like an array of portions of the video that have been downloaded.
    // So far no browsers return more than one range (portion)
    buffered() {
      var buffered = this.techGet("buffered");
      var start = 0;

      var // Default end to 0 and store in values
      end = this.values.bufferEnd = this.values.bufferEnd || 0;

      var timeRange;

      if (buffered && buffered.length > 0 && buffered.end(0) !== end) {
        end = buffered.end(0);
        // Storing values allows them be overridden by setBufferedFromProgress
        this.values.bufferEnd = end;
      }

      return _V_.createTimeRange(start, end);
    },

    // Calculates amount of buffer is full. Not in spec but useful.
    bufferedPercent() {
      return (this.duration()) ? this.buffered().end(0) / this.duration() : 0;
    },

    // http://dev.w3.org/html5/spec/video.html#dom-media-volume
    volume(percentAsDecimal) {
      var vol;

      if (percentAsDecimal !== undefined) {
        vol = Math.max(0, Math.min(1, parseFloat(percentAsDecimal))); // Force value to between 0 and 1
        this.values.volume = vol;
        this.techCall("setVolume", vol);
        _V_.setLocalStorage("volume", vol);
        return this;
      }

      // Default to 1 when returning current volume.
      vol = parseFloat(this.techGet("volume"));
      return (isNaN(vol)) ? 1 : vol;
    },

    // http://dev.w3.org/html5/spec/video.html#attr-media-muted
    muted(muted) {
      if (muted !== undefined) {
        this.techCall("setMuted", muted);
        return this;
      }
      return this.techGet("muted") || false; // Default to false
    },

    // http://dev.w3.org/html5/spec/dimension-attributes.html#attr-dim-height
    // Video tag width/height only work in pixels. No percents.
    // But allowing limited percents use. e.g. width() will return number+%, not computed width
    width(num, skipListeners) {
      return this.dimension("width", num, skipListeners);
    },
    height(num, skipListeners) {
      return this.dimension("height", num, skipListeners);
    },
    // Set both width and height at the same time.
    size(width, height) {
      // Skip resize listeners on width for optimization
      return this.width(width, true).height(height);
    },
    dimension(widthOrHeight, num, skipListeners) {
      if (num !== undefined) {

        // Cache on object to be returned. Shouldn't have any effect after CSS.
        this.el[widthOrHeight] = num;

        // Check if using percent width/height and adjust
        if ((""+num).indexOf("%") !== -1) {
          this.el.style[widthOrHeight] = num;
        } else {
          this.el.style[widthOrHeight] = num+"px";
        }

        // skipListeners allows us to avoid triggering the resize event when setting both width and height
        if (!skipListeners) { this.trigger("resize"); }
        return this;
      }

      // Returns cached width/height in attribute.
      // Could make this return computed width and support %s. Not a small amount of work.
      return parseInt(this.el.getAttribute(widthOrHeight));
    },

    // Check if current tech can support native fullscreen (e.g. with built in controls lik iOS, so not our flash swf)
    supportsFullScreen() { return this.techGet("supportsFullScreen") || false; },

    // Turn on fullscreen (or window) mode
    requestFullScreen() {
      var requestFullScreen = _V_.support.requestFullScreen;

      this.isFullScreen = true;

      // Check for browser element fullscreen support
      if (requestFullScreen) {

        // Trigger fullscreenchange event after change
        _V_.on(document, requestFullScreen.eventName, this.proxy(function(...args) {
          this.isFullScreen = document[requestFullScreen.isFullScreen];

          // If cancelling fullscreen, remove event listener.
          if (this.isFullScreen == false) {
            _V_.removeEvent(document, requestFullScreen.eventName, args.callee);
          }

          this.trigger("fullscreenchange");
        }));

        // Flash and other plugins get reloaded when you take their parent to fullscreen.
        // To fix that we'll remove the tech, and reload it after the resize has finished.
        if (this.tech.support.fullscreenResize === false && this.options.flash.iFrameMode != true) {

          this.pause();
          this.unloadTech();

          _V_.on(document, requestFullScreen.eventName, this.proxy(function(...args) {
            _V_.removeEvent(document, requestFullScreen.eventName, args.callee);
            this.loadTech(this.techName, { src: this.values.src });
          }));

          this.el[requestFullScreen.requestFn]();

        } else {
          this.el[requestFullScreen.requestFn]();
        }

      } else if (this.tech.supportsFullScreen()) {
        this.trigger("fullscreenchange");
        this.techCall("enterFullScreen");

      } else {
        this.trigger("fullscreenchange");
        this.enterFullWindow();
      }

       return this;
     },

     cancelFullScreen() {
      var requestFullScreen = _V_.support.requestFullScreen;

      this.isFullScreen = false;

      // Check for browser element fullscreen support
      if (requestFullScreen) {

       // Flash and other plugins get reloaded when you take their parent to fullscreen.
       // To fix that we'll remove the tech, and reload it after the resize has finished.
       if (this.tech.support.fullscreenResize === false && this.options.flash.iFrameMode != true) {

         this.pause();
         this.unloadTech();

         _V_.on(document, requestFullScreen.eventName, this.proxy(function(...args) {
           _V_.removeEvent(document, requestFullScreen.eventName, args.callee);
           this.loadTech(this.techName, { src: this.values.src })
         }));

         document[requestFullScreen.cancelFn]();

       } else {
         document[requestFullScreen.cancelFn]();
       }

      } else if (this.tech.supportsFullScreen()) {
       this.techCall("exitFullScreen");
       this.trigger("fullscreenchange");

      } else {
       this.exitFullWindow();
       this.trigger("fullscreenchange");
      }

      return this;
    },

    // When fullscreen isn't supported we can stretch the video container to as wide as the browser will let us.
    enterFullWindow() {
      this.isFullWindow = true;

      // Storing original doc overflow value to return to when fullscreen is off
      this.docOrigOverflow = document.documentElement.style.overflow;

      // Add listener for esc key to exit fullscreen
      _V_.on(document, "keydown", _V_.proxy(this, this.fullWindowOnEscKey));

      // Hide any scroll bars
      document.documentElement.style.overflow = 'hidden';

      // Apply fullscreen styles
      _V_.addClass(document.body, "vjs-full-window");
      _V_.addClass(this.el, "vjs-fullscreen");

      this.trigger("enterFullWindow");
    },
    fullWindowOnEscKey(event) {
      if (event.keyCode == 27) {
        if (this.isFullScreen == true) {
          this.cancelFullScreen();
        } else {
          this.exitFullWindow();
        }
      }
    },

    exitFullWindow() {
      this.isFullWindow = false;
      _V_.removeEvent(document, "keydown", this.fullWindowOnEscKey);

      // Unhide scroll bars.
      document.documentElement.style.overflow = this.docOrigOverflow;

      // Remove fullscreen styles
      _V_.removeClass(document.body, "vjs-full-window");
      _V_.removeClass(this.el, "vjs-fullscreen");

      // Resize the box, controller, and poster to original sizes
      // this.positionAll();
      this.trigger("exitFullWindow");
    },

    selectSource(sources) {

      // Loop through each playback technology in the options order
      for (var i=0,j=this.options.techOrder;i<j.length;i++) {
        var techName = j[i];
        // tech = _V_.tech[techName];

        var tech = _V_[techName];

        // Check if the browser supports this technology
        if (tech.isSupported()) {

          // Loop through each source object
          for (var a=0,b=sources;a<b.length;a++) {
            var source = b[a];

            // Check if source can be played with this technology
            if (tech.canPlaySource.call(this, source)) {

              return { source, tech: techName };

            }
          }
        }
      }

      return false;
    },

    // src is a pretty powerful function
    // If you pass it an array of source objects, it will find the best source to play and use that object.src
    //   If the new source requires a new playback technology, it will switch to that.
    // If you pass it an object, it will set the source to object.src
    // If you pass it anything else (url string) it will set the video source to that
    src(source) {
      // Case: Array of source objects to choose from and pick the best to play
      if (source instanceof Array) {
        var sourceTech = this.selectSource(source);
        var source;
        var techName;

        if (sourceTech) {
            source = sourceTech.source;
            techName = sourceTech.tech;

          // If this technology is already loaded, set source
          if (techName == this.techName) {
            this.src(source); // Passing the source object

          // Otherwise load this technology with chosen source
          } else {
            this.loadTech(techName, source);
          }
        } else {
          _V_.log("No compatible source and playback technology were found.")
        }

        // Case: Source object { src: "", type: "" ... }
      } else if (source instanceof Object) {

        if (_V_[this.techName].canPlaySource(source)) {
          this.src(source.src);
        } else {
          // Send through tech loop to check for a compatible technology.
          this.src([source]);
        }

      // Case: URL String (http://myvideo...)
      } else {
        // Cache for getting last set source
        this.values.src = source;

        if (!this.isReady) {
          this.ready(function(){
            this.src(source);
          });
        } else {
          this.techCall("src", source);
          if (this.options.preload == "auto") {
            this.load();
          }
          if (this.options.autoplay) {
            this.play();
          }
        }
      }
      return this;
    },

    // Begin loading the src data
    // http://dev.w3.org/html5/spec/video.html#dom-media-load
    load() {
      this.techCall("load");
      return this;
    },

    // http://dev.w3.org/html5/spec/video.html#dom-media-currentsrc
    currentSrc() {
      return this.techGet("currentSrc") || this.values.src || "";
    },

    // Attributes/Options
    preload(value) {
      if (value !== undefined) {
        this.techCall("setPreload", value);
        this.options.preload = value;
        return this;
      }
      return this.techGet("preload");
    },
    autoplay(value) {
      if (value !== undefined) {
        this.techCall("setAutoplay", value);
        this.options.autoplay = value;
        return this;
      }
      return this.techGet("autoplay", value);
    },
    loop(value) {
      if (value !== undefined) {
        this.techCall("setLoop", value);
        this.options.loop = value;
        return this;
      }
      return this.techGet("loop");
    },

    controls() { return this.options.controls; },
    poster() { return this.techGet("poster"); },
    error() { return this.techGet("error"); },
    ended() { return this.techGet("ended"); }

    // Methods to add support for
    // networkState: function(){ return this.techCall("networkState"); },
    // readyState: function(){ return this.techCall("readyState"); },
    // seeking: function(){ return this.techCall("seeking"); },
    // initialTime: function(){ return this.techCall("initialTime"); },
    // startOffsetTime: function(){ return this.techCall("startOffsetTime"); },
    // played: function(){ return this.techCall("played"); },
    // seekable: function(){ return this.techCall("seekable"); },
    // videoTracks: function(){ return this.techCall("videoTracks"); },
    // audioTracks: function(){ return this.techCall("audioTracks"); },
    // videoWidth: function(){ return this.techCall("videoWidth"); },
    // videoHeight: function(){ return this.techCall("videoHeight"); },
    // defaultPlaybackRate: function(){ return this.techCall("defaultPlaybackRate"); },
    // playbackRate: function(){ return this.techCall("playbackRate"); },
    // mediaGroup: function(){ return this.techCall("mediaGroup"); },
    // controller: function(){ return this.techCall("controller"); },
    // defaultMuted: function(){ return this.techCall("defaultMuted"); }
  });

  // RequestFullscreen API
  ((() => {
    var requestFn;
    var cancelFn;
    var eventName;
    var isFullScreen;
    var playerProto = _V_.Player.prototype;

    // Current W3C Spec
    // http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html#api
    // Mozilla Draft: https://wiki.mozilla.org/Gecko:FullScreenAPI#fullscreenchange_event
    if (document.cancelFullscreen !== undefined) {
      requestFn = "requestFullscreen";
      cancelFn = "exitFullscreen";
      eventName = "fullscreenchange";
      isFullScreen = "fullScreen";

    // Webkit (Chrome/Safari) and Mozilla (Firefox) have working implementaitons
    // that use prefixes and vary slightly from the new W3C spec. Specifically, using 'exit' instead of 'cancel',
    // and lowercasing the 'S' in Fullscreen.
    // Other browsers don't have any hints of which version they might follow yet, so not going to try to predict by loopeing through all prefixes.
    } else {

      _V_.each(["moz", "webkit"], prefix => {

        // https://github.com/zencoder/video-js/pull/128
        if ((prefix != "moz" || document.mozFullScreenEnabled) && document[prefix + "CancelFullScreen"] !== undefined) {
          requestFn = prefix + "RequestFullScreen";
          cancelFn = prefix + "CancelFullScreen";
          eventName = prefix + "fullscreenchange";

          if (prefix == "webkit") {
            isFullScreen = prefix + "IsFullScreen";
          } else {
            isFullScreen = prefix + "FullScreen";
          }
        }

      });

    }

    if (requestFn) {
      _V_.support.requestFullScreen = {
        requestFn,
        cancelFn,
        eventName,
        isFullScreen
      };
    }
  }))();/* Playback Technology - Base class for playback technologies
================================================================================ */
  _V_.PlaybackTech = _V_.Component.extend({
    init(player, options) {
      // this._super(player, options);

      // Make playback element clickable
      // _V_.addEvent(this.el, "click", _V_.proxy(this, _V_.PlayToggle.prototype.onClick));

      // this.addEvent("click", this.proxy(this.onClick));

      // player.triggerEvent("techready");
    },
    // destroy: function(){},
    // createElement: function(){},
    onClick() {
      if (this.player.options.controls) {
        _V_.PlayToggle.prototype.onClick.call(this);
      }
    }
  });

  // Create placeholder methods for each that warn when a method isn't supported by the current playback technology
  _V_.apiMethods = "play,pause,paused,currentTime,setCurrentTime,duration,buffered,volume,setVolume,muted,setMuted,width,height,supportsFullScreen,enterFullScreen,src,load,currentSrc,preload,setPreload,autoplay,setAutoplay,loop,setLoop,error,networkState,readyState,seeking,initialTime,startOffsetTime,played,seekable,ended,videoTracks,audioTracks,videoWidth,videoHeight,textTracks,defaultPlaybackRate,playbackRate,mediaGroup,controller,controls,defaultMuted".split(",");
  _V_.each(_V_.apiMethods, methodName => {
    _V_.PlaybackTech.prototype[methodName] = () => {
      throw new Error("The '"+methodName+"' method is not available on the playback technology's API");
    }
  });

  /* HTML5 Playback Technology - Wrapper for HTML5 Media API
  ================================================================================ */
  _V_.html5 = _V_.PlaybackTech.extend({

    init(player, options, ready) {
      this.player = player;
      this.el = this.createElement();
      this.ready(ready);

      this.addEvent("click", this.proxy(this.onClick));

      var source = options.source;

      // If the element source is already set, we may have missed the loadstart event, and want to trigger it.
      // We don't want to set the source again and interrupt playback.
      if (source && this.el.currentSrc == source.src) {
        player.triggerEvent("loadstart");

      // Otherwise set the source if one was provided.
      } else if (source) {
        this.el.src = source.src;
      }

      // Chrome and Safari both have issues with autoplay.
      // In Safari (5.1.1), when we move the video element into the container div, autoplay doesn't work.
      // In Chrome (15), if you have autoplay + a poster + no controls, the video gets hidden (but audio plays)
      // This fixes both issues. Need to wait for API, so it updates displays correctly
      player.ready(function(){
        if (this.options.autoplay && this.paused()) {
          this.tag.poster = null; // Chrome Fix. Fixed in Chrome v16.
          this.play();
        }
      });

      this.setupTriggers();

      this.triggerReady();
    },

    destroy() {
      this.player.tag = false;
      this.removeTriggers();
      this.el.parentNode.removeChild(this.el);
    },

    createElement() {
      var html5 = _V_.html5;
      var player = this.player;

      var // If possible, reuse original tag for HTML5 playback technology element
      el = player.tag;

      var newEl;

      // Check if this browser supports moving the element into the box.
      // On the iPhone video will break if you move the element,
      // So we have to create a brand new element.
      if (!el || this.support.movingElementInDOM === false) {

        // If the original tag is still there, remove it.
        if (el) {
          player.el.removeChild(el);
        }

        newEl = _V_.createElement("video", {
          id: el.id || player.el.id + "_html5_api",
          className: el.className || "vjs-tech"
        });

        el = newEl;
        _V_.insertFirst(el, player.el);
      }

      // Update tag settings, in case they were overridden
      _V_.each(["autoplay","preload","loop","muted"], attr => { // ,"poster"
        if (player.options[attr] !== null) {
          el[attr] = player.options[attr];
        }
      }, this);

      return el;
    },

    // Make video events trigger player events
    // May seem verbose here, but makes other APIs possible.
    setupTriggers() {
      _V_.each.call(this, _V_.html5.events, function(type){
        _V_.addEvent(this.el, type, _V_.proxy(this.player, this.eventHandler));
      });
    },
    removeTriggers() {
      _V_.each.call(this, _V_.html5.events, function(type){
        _V_.removeEvent(this.el, type, _V_.proxy(this.player, this.eventHandler));
      });
    },
    eventHandler(e) {
      e.stopPropagation();
      this.triggerEvent(e);
    },

    play() { this.el.play(); },
    pause() { this.el.pause(); },
    paused() { return this.el.paused; },

    currentTime() { return this.el.currentTime; },
    setCurrentTime(seconds) {
      try {
        this.el.currentTime = seconds;
        } catch(e) {
          _V_.log(e, "Video isn't ready. (VideoJS)");
        // this.warning(VideoJS.warnings.videoNotReady);
      }
    },

    duration() { return this.el.duration || 0; },
    buffered() { return this.el.buffered; },

    volume() { return this.el.volume; },
    setVolume(percentAsDecimal) { this.el.volume = percentAsDecimal; },
    muted() { return this.el.muted; },
    setMuted(muted) { this.el.muted = muted },

    width() { return this.el.offsetWidth; },
    height() { return this.el.offsetHeight; },

    supportsFullScreen() {
      if (typeof this.el.webkitEnterFullScreen == 'function') {

        // Seems to be broken in Chromium/Chrome && Safari in Leopard
        if (!navigator.userAgent.match("Chrome") && !navigator.userAgent.match("Mac OS X 10.5")) {
          return true;
        }
      }
      return false;
    },

    enterFullScreen() {
        try {
          this.el.webkitEnterFullScreen();
        } catch (e) {
          if (e.code == 11) {
            // this.warning(VideoJS.warnings.videoNotReady);
            _V_.log("VideoJS: Video not ready.")
          }
        }
    },
    exitFullScreen() {
        try {
          this.el.webkitExitFullScreen();
        } catch (e) {
          if (e.code == 11) {
            // this.warning(VideoJS.warnings.videoNotReady);
            _V_.log("VideoJS: Video not ready.")
          }
        }
    },
    src(src) { this.el.src = src; },
    load() { this.el.load(); },
    currentSrc() { return this.el.currentSrc; },

    preload() { return this.el.preload; },
    setPreload(val) { this.el.preload = val; },
    autoplay() { return this.el.autoplay; },
    setAutoplay(val) { this.el.autoplay = val; },
    loop() { return this.el.loop; },
    setLoop(val) { this.el.loop = val; },

    error() { return this.el.error; },
    // networkState: function(){ return this.el.networkState; },
    // readyState: function(){ return this.el.readyState; },
    seeking() { return this.el.seeking; },
    // initialTime: function(){ return this.el.initialTime; },
    // startOffsetTime: function(){ return this.el.startOffsetTime; },
    // played: function(){ return this.el.played; },
    // seekable: function(){ return this.el.seekable; },
    ended() { return this.el.ended; },
    // videoTracks: function(){ return this.el.videoTracks; },
    // audioTracks: function(){ return this.el.audioTracks; },
    // videoWidth: function(){ return this.el.videoWidth; },
    // videoHeight: function(){ return this.el.videoHeight; },
    // textTracks: function(){ return this.el.textTracks; },
    // defaultPlaybackRate: function(){ return this.el.defaultPlaybackRate; },
    // playbackRate: function(){ return this.el.playbackRate; },
    // mediaGroup: function(){ return this.el.mediaGroup; },
    // controller: function(){ return this.el.controller; },
    controls() { return this.player.options.controls; },
    defaultMuted() { return this.el.defaultMuted; }
  });

  /* HTML5 Support Testing -------------------------------------------------------- */

  _V_.html5.isSupported = () => !!document.createElement("video").canPlayType;

  _V_.html5.canPlaySource = srcObj => // TODO: Check Type
  // If no Type, check ext
  // Check Media Type
  !!document.createElement("video").canPlayType(srcObj.type);

  // List of all HTML5 events (various uses).
  _V_.html5.events = "loadstart,suspend,abort,error,emptied,stalled,loadedmetadata,loadeddata,canplay,canplaythrough,playing,waiting,seeking,seeked,ended,durationchange,timeupdate,progress,play,pause,ratechange,volumechange".split(",");

  /* HTML5 Device Fixes ---------------------------------------------------------- */

  _V_.html5.prototype.support = {

    // Support for tech specific full screen. (webkitEnterFullScreen, not requestFullscreen)
    // http://developer.apple.com/library/safari/#documentation/AudioVideo/Reference/HTMLVideoElementClassReference/HTMLVideoElement/HTMLVideoElement.html
    // Seems to be broken in Chromium/Chrome && Safari in Leopard
    fullscreen: (typeof _V_.testVid.webkitEnterFullScreen !== undefined) ? (!_V_.ua.match("Chrome") && !_V_.ua.match("Mac OS X 10.5") ? true : false) : false,

    // In iOS, if you move a video element in the DOM, it breaks video playback.
    movingElementInDOM: !_V_.isIOS()

  };

  // Android
  if (_V_.isAndroid()) {

    // Override Android 2.2 and less canPlayType method which is broken
    if (_V_.androidVersion() < 3) {
      document.createElement("video").constructor.prototype.canPlayType = type => (type && type.toLowerCase().indexOf("video/mp4") != -1) ? "maybe" : "";
    }
  }


  /* VideoJS-SWF - Custom Flash Player with HTML5-ish API - https://github.com/zencoder/video-js-swf
  ================================================================================ */
  _V_.flash = _V_.PlaybackTech.extend({

    init(player, options) {
      this.player = player;

      var source = options.source;

      var // Which element to embed in
      parentEl = options.parentEl;

      var // Create a temporary element to be replaced by swf object
      placeHolder = this.el = _V_.createElement("div", { id: parentEl.id + "_temp_flash" });

      var // Generate ID for swf object
      objId = player.el.id+"_flash_api";

      var // Store player options in local var for optimization
      playerOptions = player.options;

      var // Merge default flashvars with ones passed in to init
      flashVars = _V_.merge({

        // SWF Callback Functions
        readyFunction: "_V_.flash.onReady",
        eventProxyFunction: "_V_.flash.onEvent",
        errorEventProxyFunction: "_V_.flash.onError",

        // Player Settings
        autoplay: playerOptions.autoplay,
        preload: playerOptions.preload,
        loop: playerOptions.loop,
        muted: playerOptions.muted

      }, options.flashVars);

      var // Merge default parames with ones passed in
      params = _V_.merge({
        wmode: "opaque", // Opaque is needed to overlay controls, but can affect playback performance
        bgcolor: "#000000" // Using bgcolor prevents a white flash when the object is loading
      }, options.params);

      var // Merge default attributes with ones passed in
      attributes = _V_.merge({
        id: objId,
        name: objId, // Both ID and Name needed or swf to identifty itself
        'class': 'vjs-tech'
      }, options.attributes);

      // If source was supplied pass as a flash var.
      if (source) {
        flashVars.src = encodeURIComponent(_V_.getAbsoluteURL(source.src));
      }

      // Add placeholder to player div
      _V_.insertFirst(placeHolder, parentEl);

      // Having issues with Flash reloading on certain page actions (hide/resize/fullscreen) in certain browsers
      // This allows resetting the playhead when we catch the reload
      if (options.startTime) {
        this.ready(function(){
          this.load();
          this.play();
          this.currentTime(options.startTime);
        });
      }

      // Flash iFrame Mode
      // In web browsers there are multiple instances where changing the parent element or visibility of a plugin causes the plugin to reload.
      // - Firefox just about always. https://bugzilla.mozilla.org/show_bug.cgi?id=90268 (might be fixed by version 13)
      // - Webkit when hiding the plugin
      // - Webkit and Firefox when using requestFullScreen on a parent element
      // Loading the flash plugin into a dynamically generated iFrame gets around most of these issues.
      // Issues that remain include hiding the element and requestFullScreen in Firefox specifically

      // There's on particularly annoying issue with this method which is that Firefox throws a security error on an offsite Flash object loaded into a dynamically created iFrame.
      // Even though the iframe was inserted into a page on the web, Firefox + Flash considers it a local app trying to access an internet file.
      // I tried mulitple ways of setting the iframe src attribute but couldn't find a src that worked well. Tried a real/fake source, in/out of domain.
      // Also tried a method from stackoverflow that caused a security error in all browsers. http://stackoverflow.com/questions/2486901/how-to-set-document-domain-for-a-dynamically-generated-iframe
      // In the end the solution I found to work was setting the iframe window.location.href right before doing a document.write of the Flash object.
      // The only downside of this it seems to trigger another http request to the original page (no matter what's put in the href). Not sure why that is.

      // NOTE (2012-01-29): Cannot get Firefox to load the remote hosted SWF into a dynamically created iFrame
      // Firefox 9 throws a security error, unleess you call location.href right before doc.write.
      //    Not sure why that even works, but it causes the browser to look like it's continuously trying to load the page.
      // Firefox 3.6 keeps calling the iframe onload function anytime I write to it, causing an endless loop.

      if (options.iFrameMode == true && !_V_.isFF) {

        // Create iFrame with vjs-tech class so it's 100% width/height
        var iFrm = _V_.createElement("iframe", {
          id: objId + "_iframe",
          name: objId + "_iframe",
          className: "vjs-tech",
          scrolling: "no",
          marginWidth: 0,
          marginHeight: 0,
          frameBorder: 0
        });

        // Update ready function names in flash vars for iframe window
        flashVars.readyFunction = "ready";
        flashVars.eventProxyFunction = "events";
        flashVars.errorEventProxyFunction = "errors";

        // Tried multiple methods to get this to work in all browsers

        // Tried embedding the flash object in the page first, and then adding a place holder to the iframe, then replacing the placeholder with the page object.
        // The goal here was to try to load the swf URL in the parent page first and hope that got around the firefox security error
        // var newObj = _V_.flash.embed(options.swf, placeHolder, flashVars, params, attributes);
        // (in onload)
        //  var temp = _V_.createElement("a", { id:"asdf", innerHTML: "asdf" } );
        //  iDoc.body.appendChild(temp);

        // Tried embedding the flash object through javascript in the iframe source.
        // This works in webkit but still triggers the firefox security error
        // iFrm.src = "javascript: document.write('"+_V_.flash.getEmbedCode(options.swf, flashVars, params, attributes)+"');";

        // Tried an actual local iframe just to make sure that works, but it kills the easiness of the CDN version if you require the user to host an iframe
        // We should add an option to host the iframe locally though, because it could help a lot of issues.
        // iFrm.src = "iframe.html";

        // Wait until iFrame has loaded to write into it.
        _V_.addEvent(iFrm, "load", _V_.proxy(this, function(){
          var iDoc;
          var objTag;
          var swfLoc;
          var iWin = iFrm.contentWindow;
          var varString = "";


          // The one working method I found was to use the iframe's document.write() to create the swf object
          // This got around the security issue in all browsers except firefox.
          // I did find a hack where if I call the iframe's window.location.href="", it would get around the security error
          // However, the main page would look like it was loading indefinitely (URL bar loading spinner would never stop)
          // Plus Firefox 3.6 didn't work no matter what I tried.
          // if (_V_.ua.match("Firefox")) {
          //   iWin.location.href = "";
          // }

          // Get the iFrame's document depending on what the browser supports
          iDoc = iFrm.contentDocument ? iFrm.contentDocument : iFrm.contentWindow.document;

          // Tried ensuring both document domains were the same, but they already were, so that wasn't the issue.
          // Even tried adding /. that was mentioned in a browser security writeup
          // document.domain = document.domain+"/.";
          // iDoc.domain = document.domain+"/.";

          // Tried adding the object to the iframe doc's innerHTML. Security error in all browsers.
          // iDoc.body.innerHTML = swfObjectHTML;

          // Tried appending the object to the iframe doc's body. Security error in all browsers.
          // iDoc.body.appendChild(swfObject);

          // Using document.write actually got around the security error that browsers were throwing.
          // Again, it's a dynamically generated (same domain) iframe, loading an external Flash swf.
          // Not sure why that's a security issue, but apparently it is.
          iDoc.write(_V_.flash.getEmbedCode(options.swf, flashVars, params, attributes));

          // Setting variables on the window needs to come after the doc write because otherwise they can get reset in some browsers
          // So far no issues with swf ready event being called before it's set on the window.
          iWin.player = this.player;

          // Create swf ready function for iFrame window
          iWin.ready = _V_.proxy(this.player, function(currSwf){
            var el = iDoc.getElementById(currSwf);
            var player = this;
            var tech = player.tech;

            // Update reference to playback technology element
            tech.el = el;

            // Now that the element is ready, make a click on the swf play the video
            _V_.addEvent(el, "click", tech.proxy(tech.onClick));

            // Make sure swf is actually ready. Sometimes the API isn't actually yet.
            _V_.flash.checkReady(tech);
          });

          // Create event listener for all swf events
          iWin.events = _V_.proxy(this.player, function(swfID, eventName, other){
            var player = this;
            if (player && player.techName == "flash") {
              player.triggerEvent(eventName);
            }
          });

          // Create error listener for all swf errors
          iWin.errors = _V_.proxy(this.player, (swfID, eventName) => {
            _V_.log("Flash Error", eventName);
          });
        }));

        // Replace placeholder with iFrame (it will load now)
        placeHolder.parentNode.replaceChild(iFrm, placeHolder);

      // If not using iFrame mode, embed as normal object
      } else {
        _V_.flash.embed(options.swf, placeHolder, flashVars, params, attributes);
      }
    },

    destroy() {
      this.el.parentNode.removeChild(this.el);
    },

    // setupTriggers: function(){}, // Using global onEvent func to distribute events

    play() { this.el.vjs_play(); },
    pause() { this.el.vjs_pause(); },
    src(src) {
      // Make sure source URL is abosolute.
      src = _V_.getAbsoluteURL(src);

      this.el.vjs_src(src);

      // Currently the SWF doesn't autoplay if you load a source later.
      // e.g. Load player w/ no source, wait 2s, set src.
      if (this.player.autoplay()) {
        var tech = this;
        setTimeout(() => { tech.play(); }, 0);
      }
    },
    load() { this.el.vjs_load(); },
    poster() { this.el.vjs_getProperty("poster"); },

    buffered() {
      return _V_.createTimeRange(0, this.el.vjs_getProperty("buffered"));
    },

    supportsFullScreen() {
      return false; // Flash does not allow fullscreen through javascript
    },
    enterFullScreen() {
      return false;
    }
  });

  // Create setters and getters for attributes
  ((() => {
    var api = _V_.flash.prototype;
    var readWrite = "preload,currentTime,defaultPlaybackRate,playbackRate,autoplay,loop,mediaGroup,controller,controls,volume,muted,defaultMuted".split(",");
    var readOnly = "error,currentSrc,networkState,readyState,seeking,initialTime,duration,startOffsetTime,paused,played,seekable,ended,videoTracks,audioTracks,videoWidth,videoHeight,textTracks".split(",");
    var callOnly = "load,play,pause".split(",");
    // Overridden: buffered

    createSetter = attr => {
      var attrUpper = attr.charAt(0).toUpperCase() + attr.slice(1);
      api["set"+attrUpper] = function(val){ return this.el.vjs_setProperty(attr, val); };
    },

    createGetter = attr => {
      api[attr] = function(){ return this.el.vjs_getProperty(attr); };
    }
;

    // Create getter and setters for all read/write attributes
    _V_.each(readWrite, attr => {
      createGetter(attr);
      createSetter(attr);
    });

    // Create getters for read-only attributes
    _V_.each(readOnly, attr => {
      createGetter(attr);
    });
  }))();

  /* Flash Support Testing -------------------------------------------------------- */

  _V_.flash.isSupported = () => // return swfobject.hasFlashPlayerVersion("10");
  _V_.flash.version()[0] >= 10;

  _V_.flash.canPlaySource = srcObj => {
    if (srcObj.type in _V_.flash.prototype.support.formats) { return "maybe"; }
  };

  _V_.flash.prototype.support = {
    formats: {
      "video/flv": "FLV",
      "video/x-flv": "FLV",
      "video/mp4": "MP4",
      "video/m4v": "MP4"
    },

    // Optional events that we can manually mimic with timers
    progressEvent: false,
    timeupdateEvent: false,

    // Resizing plugins using request fullscreen reloads the plugin
    fullscreenResize: false,

    // Resizing plugins in Firefox always reloads the plugin (e.g. full window mode)
    parentResize: !(_V_.ua.match("Firefox"))
  };

  _V_.flash.onReady = currSwf => {
    var el = _V_.el(currSwf);

    // Get player from box
    // On firefox reloads, el might already have a player
    var player = el.player || el.parentNode.player;

    var tech = player.tech;

    // Reference player on tech element
    el.player = player;

    // Update reference to playback technology element
    tech.el = el;

    // Now that the element is ready, make a click on the swf play the video
    tech.addEvent("click", tech.onClick);

    _V_.flash.checkReady(tech);
  };

  // The SWF isn't alwasy ready when it says it is. Sometimes the API functions still need to be added to the object.
  // If it's not ready, we set a timeout to check again shortly.
  _V_.flash.checkReady = tech => {

    // Check if API property exists
    if (tech.el.vjs_getProperty) {

      // If so, tell tech it's ready
      tech.triggerReady();

    // Otherwise wait longer.
    } else {

      setTimeout(() => {
        _V_.flash.checkReady(tech);
      }, 50);

    }
  };

  // Trigger events from the swf on the player
  _V_.flash.onEvent = (swfID, eventName) => {
    var player = _V_.el(swfID).player;
    player.triggerEvent(eventName);
  };

  // Log errors from the swf
  _V_.flash.onError = (swfID, err) => {
    var player = _V_.el(swfID).player;
    player.triggerEvent("error");
    _V_.log("Flash Error", err, swfID);
  };

  // Flash Version Check
  _V_.flash.version = () => {
    var version = '0,0,0'

    // IE
    try {
      version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];

    // other browsers
    } catch(e) {
      try {
        if (navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){
          version = (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
        }
      } catch(e) {}
    }
    return version.split(",");
  }

  // Flash embedding method. Only used in non-iframe mode
  _V_.flash.embed = (swf, placeHolder, flashVars, params, attributes) => {
    var code = _V_.flash.getEmbedCode(swf, flashVars, params, attributes);

    var // Get element by embedding code and retrieving created element
    obj = _V_.createElement("div", { innerHTML: code }).childNodes[0];

    var par = placeHolder.parentNode;

    placeHolder.parentNode.replaceChild(obj, placeHolder);

    // IE6 seems to have an issue where it won't initialize the swf object after injecting it.
    // This is a dumb temporary fix
    if (_V_.isIE()) {
      var newObj = par.childNodes[0];
      setTimeout(() => {
        newObj.style.display = "block";
      }, 1000);
    }

    return obj;
  };

  _V_.flash.getEmbedCode = (swf, flashVars, params, attributes) => {
    var objTag = '<object type="application/x-shockwave-flash"';
    var flashVarsString = '';
    var paramsString = '';
    attrsString = '';

    // Convert flash vars to string
    if (flashVars) {
      _V_.eachProp(flashVars, (key, val) => {
        flashVarsString += (key + "=" + val + "&amp;");
      });
    }

    // Add swf, flashVars, and other default params
    params = _V_.merge({
      movie: swf,
      flashvars: flashVarsString,
      allowScriptAccess: "always", // Required to talk to swf
      allowNetworking: "all" // All should be default, but having security issues.
    }, params);

    // Create param tags string
    _V_.eachProp(params, (key, val) => {
      paramsString += '<param name="'+key+'" value="'+val+'" />';
    });

    attributes = _V_.merge({
      // Add swf to attributes (need both for IE and Others to work)
      data: swf,

      // Default to 100% width/height
      width: "100%",
      height: "100%"

    }, attributes);

    // Create Attributes string
    _V_.eachProp(attributes, (key, val) => {
      attrsString += (key + '="' + val + '" ');
    });

    return objTag + attrsString + '>' + paramsString + '</object>';
  }
  /* Control - Base class for all control elements
  ================================================================================ */
  _V_.Control = _V_.Component.extend({

    buildCSSClass() {
      return "vjs-control " + this._super();
    }

  });

  /* Control Bar
  ================================================================================ */
  _V_.ControlBar = _V_.Component.extend({

    options: {
      loadEvent: "play",
      components: {
        "playToggle": {},
        "fullscreenToggle": {},
        "currentTimeDisplay": {},
        "timeDivider": {},
        "durationDisplay": {},
        "remainingTimeDisplay": {},
        "progressControl": {},
        "volumeControl": {},
        "muteToggle": {}
      }
    },

    init(player, options) {
      this._super(player, options);

      player.one("play", this.proxy(function(){
        this.fadeIn();
        this.player.on("mouseover", this.proxy(this.fadeIn));
        this.player.on("mouseout", this.proxy(this.fadeOut));
      }));

    },

    createElement() {
      return _V_.createElement("div", {
        className: "vjs-controls"
      });
    },

    fadeIn() {
      this._super();
      this.player.trigger("controlsvisible");
    },

    fadeOut() {
      this._super();
      this.player.trigger("controlshidden");
    },

    lockShowing() {
      this.el.style.opacity = "1";
    }

  });

  /* Button - Base class for all buttons
  ================================================================================ */
  _V_.Button = _V_.Control.extend({

    init(player, options) {
      this._super(player, options);

      this.on("click", this.onClick);
      this.on("focus", this.onFocus);
      this.on("blur", this.onBlur);
    },

    createElement(type, attrs) {
      // Add standard Aria and Tabindex info
      attrs = _V_.merge({
        className: this.buildCSSClass(),
        innerHTML: '<div><span class="vjs-control-text">' + (this.buttonText || "Need Text") + '</span></div>',
        role: "button",
        tabIndex: 0
      }, attrs);

      return this._super(type, attrs);
    },

    // Click - Override with specific functionality for button
    onClick() {},

    // Focus - Add keyboard functionality to element
    onFocus() {
      _V_.on(document, "keyup", _V_.proxy(this, this.onKeyPress));
    },

    // KeyPress (document level) - Trigger click when keys are pressed
    onKeyPress(event) {
      // Check for space bar (32) or enter (13) keys
      if (event.which == 32 || event.which == 13) {
        event.preventDefault();
        this.onClick();
      }
    },

    // Blur - Remove keyboard triggers
    onBlur() {
      _V_.off(document, "keyup", _V_.proxy(this, this.onKeyPress));
    }

  });

  /* Play Button
  ================================================================================ */
  _V_.PlayButton = _V_.Button.extend({

    buttonText: "Play",

    buildCSSClass() {
      return "vjs-play-button " + this._super();
    },

    onClick() {
      this.player.play();
    }

  });

  /* Pause Button
  ================================================================================ */
  _V_.PauseButton = _V_.Button.extend({

    buttonText: "Pause",

    buildCSSClass() {
      return "vjs-pause-button " + this._super();
    },

    onClick() {
      this.player.pause();
    }

  });

  /* Play Toggle - Play or Pause Media
  ================================================================================ */
  _V_.PlayToggle = _V_.Button.extend({

    buttonText: "Play",

    init(player, options) {
      this._super(player, options);

      player.on("play", _V_.proxy(this, this.onPlay));
      player.on("pause", _V_.proxy(this, this.onPause));
    },

    buildCSSClass() {
      return "vjs-play-control " + this._super();
    },

    // OnClick - Toggle between play and pause
    onClick() {
      if (this.player.paused()) {
        this.player.play();
      } else {
        this.player.pause();
      }
    },

    // OnPlay - Add the vjs-playing class to the element so it can change appearance
    onPlay() {
      _V_.removeClass(this.el, "vjs-paused");
      _V_.addClass(this.el, "vjs-playing");
    },

    // OnPause - Add the vjs-paused class to the element so it can change appearance
    onPause() {
      _V_.removeClass(this.el, "vjs-playing");
      _V_.addClass(this.el, "vjs-paused");
    }

  });


  /* Fullscreen Toggle Behaviors
  ================================================================================ */
  _V_.FullscreenToggle = _V_.Button.extend({

    buttonText: "Fullscreen",

    buildCSSClass() {
      return "vjs-fullscreen-control " + this._super();
    },

    onClick() {
      if (!this.player.isFullScreen) {
        this.player.requestFullScreen();
      } else {
        this.player.cancelFullScreen();
      }
    }

  });

  /* Big Play Button
  ================================================================================ */
  _V_.BigPlayButton = _V_.Button.extend({
    init(player, options) {
      this._super(player, options);

      player.on("play", _V_.proxy(this, this.hide));
      player.on("ended", _V_.proxy(this, this.show));
    },

    createElement() {
      return this._super("div", {
        className: "vjs-big-play-button",
        innerHTML: "<span></span>"
      });
    },

    onClick() {
      // Go back to the beginning if big play button is showing at the end.
      // Have to check for current time otherwise it might throw a 'not ready' error.
      if(this.player.currentTime()) {
        this.player.currentTime(0);
      }
      this.player.play();
    }
  });

  /* Loading Spinner
  ================================================================================ */
  _V_.LoadingSpinner = _V_.Component.extend({
    init(player, options) {
      this._super(player, options);

      player.on("canplay", _V_.proxy(this, this.hide));
      player.on("canplaythrough", _V_.proxy(this, this.hide));
      player.on("playing", _V_.proxy(this, this.hide));

      player.on("seeking", _V_.proxy(this, this.show));
      player.on("error", _V_.proxy(this, this.show));

      // Not showing spinner on stalled any more. Browsers may stall and then not trigger any events that would remove the spinner.
      // Checked in Chrome 16 and Safari 5.1.2. http://help.videojs.com/discussions/problems/883-why-is-the-download-progress-showing
      // player.on("stalled", _V_.proxy(this, this.show));

      player.on("waiting", _V_.proxy(this, this.show));
    },

    createElement() {
      var classNameSpinner;
      var innerHtmlSpinner;

      if ( typeof this.player.el.style.WebkitBorderRadius == "string"
           || typeof this.player.el.style.MozBorderRadius == "string"
           || typeof this.player.el.style.KhtmlBorderRadius == "string"
           || typeof this.player.el.style.borderRadius == "string")
        {
          classNameSpinner = "vjs-loading-spinner";
          innerHtmlSpinner = "<div class='ball1'></div><div class='ball2'></div><div class='ball3'></div><div class='ball4'></div><div class='ball5'></div><div class='ball6'></div><div class='ball7'></div><div class='ball8'></div>";
        } else {
          classNameSpinner = "vjs-loading-spinner-fallback";
          innerHtmlSpinner = "";
        }

      return this._super("div", {
        className: classNameSpinner,
        innerHTML: innerHtmlSpinner
      });
    }
  });

  /* Time
  ================================================================================ */
  _V_.CurrentTimeDisplay = _V_.Component.extend({

    init(player, options) {
      this._super(player, options);

      player.on("timeupdate", _V_.proxy(this, this.updateContent));
    },

    createElement() {
      var el = this._super("div", {
        className: "vjs-current-time vjs-time-controls vjs-control"
      });

      this.content = _V_.createElement("div", {
        className: "vjs-current-time-display",
        innerHTML: '0:00'
      });

      el.appendChild(_V_.createElement("div").appendChild(this.content));
      return el;
    },

    updateContent() {
      // Allows for smooth scrubbing, when player can't keep up.
      var time = (this.player.scrubbing) ? this.player.values.currentTime : this.player.currentTime();
      this.content.innerHTML = _V_.formatTime(time, this.player.duration());
    }

  });

  _V_.DurationDisplay = _V_.Component.extend({

    init(player, options) {
      this._super(player, options);

      player.on("timeupdate", _V_.proxy(this, this.updateContent));
    },

    createElement() {
      var el = this._super("div", {
        className: "vjs-duration vjs-time-controls vjs-control"
      });

      this.content = _V_.createElement("div", {
        className: "vjs-duration-display",
        innerHTML: '0:00'
      });

      el.appendChild(_V_.createElement("div").appendChild(this.content));
      return el;
    },

    updateContent() {
      if (this.player.duration()) { this.content.innerHTML = _V_.formatTime(this.player.duration()); }
    }

  });

  // Time Separator (Not used in main skin, but still available, and could be used as a 'spare element')
  _V_.TimeDivider = _V_.Component.extend({

    createElement() {
      return this._super("div", {
        className: "vjs-time-divider",
        innerHTML: '<div><span>/</span></div>'
      });
    }

  });

  _V_.RemainingTimeDisplay = _V_.Component.extend({

    init(player, options) {
      this._super(player, options);

      player.on("timeupdate", _V_.proxy(this, this.updateContent));
    },

    createElement() {
      var el = this._super("div", {
        className: "vjs-remaining-time vjs-time-controls vjs-control"
      });

      this.content = _V_.createElement("div", {
        className: "vjs-remaining-time-display",
        innerHTML: '-0:00'
      });

      el.appendChild(_V_.createElement("div").appendChild(this.content));
      return el;
    },

    updateContent() {
      if (this.player.duration()) { this.content.innerHTML = "-"+_V_.formatTime(this.player.remainingTime()); }

      // Allows for smooth scrubbing, when player can't keep up.
      // var time = (this.player.scrubbing) ? this.player.values.currentTime : this.player.currentTime();
      // this.content.innerHTML = _V_.formatTime(time, this.player.duration());
    }

  });

  /* Slider - Parent for seek bar and volume slider
  ================================================================================ */
  _V_.Slider = _V_.Component.extend({

    init(player, options) {
      this._super(player, options);

      player.on(this.playerEvent, _V_.proxy(this, this.update));

      this.on("mousedown", this.onMouseDown);
      this.on("focus", this.onFocus);
      this.on("blur", this.onBlur);

      this.player.on("controlsvisible", this.proxy(this.update));

      // This is actually to fix the volume handle position. http://twitter.com/#!/gerritvanaaken/status/159046254519787520
      // this.player.one("timeupdate", this.proxy(this.update));

      this.update();
    },

    createElement(type, attrs) {
      attrs = _V_.merge({
        role: "slider",
        "aria-valuenow": 0,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        tabIndex: 0
      }, attrs);

      return this._super(type, attrs);
    },

    onMouseDown(event) {
      event.preventDefault();
      _V_.blockTextSelection();

      _V_.on(document, "mousemove", _V_.proxy(this, this.onMouseMove));
      _V_.on(document, "mouseup", _V_.proxy(this, this.onMouseUp));

      this.onMouseMove(event);
    },

    onMouseUp(event) {
      _V_.unblockTextSelection();
      _V_.off(document, "mousemove", this.onMouseMove, false);
      _V_.off(document, "mouseup", this.onMouseUp, false);

      this.update();
    },

    update() {
      // If scrubbing, we could use a cached value to make the handle keep up with the user's mouse.
      // On HTML5 browsers scrubbing is really smooth, but some flash players are slow, so we might want to utilize this later.
      // var progress =  (this.player.scrubbing) ? this.player.values.currentTime / this.player.duration() : this.player.currentTime() / this.player.duration();

      var barProgress;

      var progress = this.getPercent();
      handle = this.handle,
      bar = this.bar;

      // Protect against no duration and other division issues
      if (isNaN(progress)) { progress = 0; }

      barProgress = progress;

      // If there is a handle, we need to account for the handle in our calculation for progress bar
      // so that it doesn't fall short of or extend past the handle.
      if (handle) {
        var box = this.el;
        var boxWidth = box.offsetWidth;
        var handleWidth = handle.el.offsetWidth;

        var // The width of the handle in percent of the containing box
        // In IE, widths may not be ready yet causing NaN
        handlePercent = (handleWidth) ? handleWidth / boxWidth : 0;

        var // Get the adjusted size of the box, considering that the handle's center never touches the left or right side.
        // There is a margin of half the handle's width on both sides.
        boxAdjustedPercent = 1 - handlePercent;

        // Adjust the progress that we'll use to set widths to the new adjusted box width
        adjustedProgress = progress * boxAdjustedPercent,

        // The bar does reach the left side, so we need to account for this in the bar's width
        barProgress = adjustedProgress + (handlePercent / 2);

        // Move the handle from the left based on the adjected progress
        handle.el.style.left = _V_.round(adjustedProgress * 100, 2) + "%";
      }

      // Set the new bar width
      bar.el.style.width = _V_.round(barProgress * 100, 2) + "%";
    },

    calculateDistance(event) {
      var box = this.el;
      var boxX = _V_.findPosX(box);
      var boxW = box.offsetWidth;
      var handle = this.handle;

      if (handle) {
        var handleW = handle.el.offsetWidth;

        // Adjusted X and Width, so handle doesn't go outside the bar
        boxX = boxX + (handleW / 2);
        boxW = boxW - handleW;
      }

      // Percent that the click is through the adjusted area
      return Math.max(0, Math.min(1, (event.pageX - boxX) / boxW));
    },

    onFocus(event) {
      _V_.on(document, "keyup", _V_.proxy(this, this.onKeyPress));
    },

    onKeyPress(event) {
      if (event.which == 37) { // Left Arrow
        event.preventDefault();
        this.stepBack();
      } else if (event.which == 39) { // Right Arrow
        event.preventDefault();
        this.stepForward();
      }
    },

    onBlur(event) {
      _V_.off(document, "keyup", _V_.proxy(this, this.onKeyPress));
    }
  });


  /* Progress
  ================================================================================ */

  // Progress Control: Seek, Load Progress, and Play Progress
  _V_.ProgressControl = _V_.Component.extend({

    options: {
      components: {
        "seekBar": {}
      }
    },

    createElement() {
      return this._super("div", {
        className: "vjs-progress-control vjs-control"
      });
    }

  });

  // Seek Bar and holder for the progress bars
  _V_.SeekBar = _V_.Slider.extend({

    options: {
      components: {
        "loadProgressBar": {},

        // Set property names to bar and handle to match with the parent Slider class is looking for
        "bar": { componentClass: "PlayProgressBar" },
        "handle": { componentClass: "SeekHandle" }
      }
    },

    playerEvent: "timeupdate",

    init(player, options) {
      this._super(player, options);
    },

    createElement() {
      return this._super("div", {
        className: "vjs-progress-holder"
      });
    },

    getPercent() {
      return this.player.currentTime() / this.player.duration();
    },

    onMouseDown(event) {
      this._super(event);

      this.player.scrubbing = true;

      this.videoWasPlaying = !this.player.paused();
      this.player.pause();
    },

    onMouseMove(event) {
      var newTime = this.calculateDistance(event) * this.player.duration();

      // Don't let video end while scrubbing.
      if (newTime == this.player.duration()) { newTime = newTime - 0.1; }

      // Set new time (tell player to seek to new time)
      this.player.currentTime(newTime);
    },

    onMouseUp(event) {
      this._super(event);

      this.player.scrubbing = false;
      if (this.videoWasPlaying) {
        this.player.play();
      }
    },

    stepForward() {
      this.player.currentTime(this.player.currentTime() + 1);
    },

    stepBack() {
      this.player.currentTime(this.player.currentTime() - 1);
    }

  });

  // Load Progress Bar
  _V_.LoadProgressBar = _V_.Component.extend({

    init(player, options) {
      this._super(player, options);
      player.on("progress", _V_.proxy(this, this.update));
    },

    createElement() {
      return this._super("div", {
        className: "vjs-load-progress",
        innerHTML: '<span class="vjs-control-text">Loaded: 0%</span>'
      });
    },

    update() {
      if (this.el.style) { this.el.style.width = _V_.round(this.player.bufferedPercent() * 100, 2) + "%"; }
    }

  });

  // Play Progress Bar
  _V_.PlayProgressBar = _V_.Component.extend({

    createElement() {
      return this._super("div", {
        className: "vjs-play-progress",
        innerHTML: '<span class="vjs-control-text">Progress: 0%</span>'
      });
    }

  });

  // Seek Handle
  // SeekBar Behavior includes play progress bar, and seek handle
  // Needed so it can determine seek position based on handle position/size
  _V_.SeekHandle = _V_.Component.extend({

    createElement() {
      return this._super("div", {
        className: "vjs-seek-handle",
        innerHTML: '<span class="vjs-control-text">00:00</span>'
      });
    }

  });

  /* Volume Scrubber
  ================================================================================ */
  // Progress Control: Seek, Load Progress, and Play Progress
  _V_.VolumeControl = _V_.Component.extend({

    options: {
      components: {
        "volumeBar": {}
      }
    },

    createElement() {
      return this._super("div", {
        className: "vjs-volume-control vjs-control"
      });
    }

  });

  _V_.VolumeBar = _V_.Slider.extend({

    options: {
      components: {
        "bar": { componentClass: "VolumeLevel" },
        "handle": { componentClass: "VolumeHandle" }
      }
    },

    playerEvent: "volumechange",

    createElement() {
      return this._super("div", {
        className: "vjs-volume-bar"
      });
    },

    onMouseMove(event) {
      this.player.volume(this.calculateDistance(event));
    },

    getPercent() {
     return this.player.volume();
    },

    stepForward() {
      this.player.volume(this.player.volume() + 0.1);
    },

    stepBack() {
      this.player.volume(this.player.volume() - 0.1);
    }
  });

  _V_.VolumeLevel = _V_.Component.extend({

    createElement() {
      return this._super("div", {
        className: "vjs-volume-level",
        innerHTML: '<span class="vjs-control-text"></span>'
      });
    }

  });

  _V_.VolumeHandle = _V_.Component.extend({

    createElement() {
      return this._super("div", {
        className: "vjs-volume-handle",
        innerHTML: '<span class="vjs-control-text"></span>'
        // tabindex: 0,
        // role: "slider", "aria-valuenow": 0, "aria-valuemin": 0, "aria-valuemax": 100
      });
    }

  });

  _V_.MuteToggle = _V_.Button.extend({

    init(player, options) {
      this._super(player, options);

      player.on("volumechange", _V_.proxy(this, this.update));
    },

    createElement() {
      return this._super("div", {
        className: "vjs-mute-control vjs-control",
        innerHTML: '<div><span class="vjs-control-text">Mute</span></div>'
      });
    },

    onClick(event) {
      this.player.muted( this.player.muted() ? false : true );
    },

    update(event) {
      var vol = this.player.volume();
      var level = 3;

      if (vol == 0 || this.player.muted()) {
        level = 0;
      } else if (vol < 0.33) {
        level = 1;
      } else if (vol < 0.67) {
        level = 2;
      }

      /* TODO improve muted icon classes */
      _V_.each.call(this, [0,1,2,3], function(i){
        _V_.removeClass(this.el, "vjs-vol-"+i);
      });
      _V_.addClass(this.el, "vjs-vol-"+level);
    }

  });


  /* Poster Image
  ================================================================================ */
  _V_.PosterImage = _V_.Button.extend({
    init(player, options) {
      this._super(player, options);

      if (!this.player.options.poster) {
        this.hide();
      }

      player.on("play", _V_.proxy(this, this.hide));
    },

    createElement() {
      return _V_.createElement("img", {
        className: "vjs-poster",
        src: this.player.options.poster,

        // Don't want poster to be tabbable.
        tabIndex: -1
      });
    },

    onClick() {
      this.player.play();
    }
  });

  /* Menu
  ================================================================================ */
  // The base for text track and settings menu buttons.
  _V_.Menu = _V_.Component.extend({

    init(player, options) {
      this._super(player, options);
    },

    addItem(component) {
      this.addComponent(component);
      component.on("click", this.proxy(function(){
        this.unlockShowing();
      }));
    },

    createElement() {
      return this._super("ul", {
        className: "vjs-menu"
      });
    }

  });

  _V_.MenuItem = _V_.Button.extend({

    init(player, options) {
      this._super(player, options);

      if (options.selected) {
        this.addClass("vjs-selected");
      }
    },

    createElement(type, attrs) {
      return this._super("li", _V_.merge({
        className: "vjs-menu-item",
        innerHTML: this.options.label
      }, attrs));
    },

    onClick() {
      this.selected(true);
    },

    selected(selected) {
      if (selected) {
        this.addClass("vjs-selected");
      } else {
        this.removeClass("vjs-selected")
      }
    }

  });// TEXT TRACKS
  // Text tracks are tracks of timed text events.
  //    Captions - text displayed over the video for the hearing impared
  //    Subtitles - text displayed over the video for those who don't understand langauge in the video
  //    Chapters - text displayed in a menu allowing the user to jump to particular points (chapters) in the video
  //    Descriptions (not supported yet) - audio descriptions that are read back to the user by a screen reading device

  // Player Track Functions - Functions add to the player object for easier access to tracks
  _V_.merge(_V_.Player.prototype, {

    // Add an array of text tracks. captions, subtitles, chapters, descriptions
    // Track objects will be stored in the player.textTracks array
    addTextTracks(trackObjects) {
      var tracks = this.textTracks = (this.textTracks) ? this.textTracks : [];
      var i = 0;
      var j = trackObjects.length;
      var track;
      var Kind;

      for (;i<j;i++) {
        // HTML5 Spec says default to subtitles.
        // Uppercase (uc) first letter to match class names
        Kind = _V_.uc(trackObjects[i].kind || "subtitles");

        // Create correct texttrack class. CaptionsTrack, etc.
        track = new _V_[Kind + "Track"](this, trackObjects[i]);

        tracks.push(track);

        // If track.default is set, start showing immediately
        // TODO: Add a process to deterime the best track to show for the specific kind
        // Incase there are mulitple defaulted tracks of the same kind
        // Or the user has a set preference of a specific language that should override the default
        if (track['default']) {
          this.ready(_V_.proxy(track, track.show));
        }
      }

      // Return the track so it can be appended to the display component
      return this;
    },

    // Show a text track
    // disableSameKind: disable all other tracks of the same kind. Value should be a track kind (captions, etc.)
    showTextTrack(id, disableSameKind) {
      var tracks = this.textTracks;
      var i = 0;
      var j = tracks.length;
      var track;
      var showTrack;
      var kind;

      // Find Track with same ID
      for (;i<j;i++) {
        track = tracks[i];
        if (track.id === id) {
          track.show();
          showTrack = track;

        // Disable tracks of the same kind
        } else if (disableSameKind && track.kind == disableSameKind && track.mode > 0) {
          track.disable();
        }
      }

      // Get track kind from shown track or disableSameKind
      kind = (showTrack) ? showTrack.kind : ((disableSameKind) ? disableSameKind : false);

      // Trigger trackchange event, captionstrackchange, subtitlestrackchange, etc.
      if (kind) {
        this.trigger(kind+"trackchange");
      }

      return this;
    }

  });

  // Track Class
  // Contains track methods for loading, showing, parsing cues of tracks
  _V_.Track = _V_.Component.extend({

    init(player, options) {
      this._super(player, options);

      // Apply track info to track object
      // Options will often be a track element
      _V_.merge(this, {
        // Build ID if one doesn't exist
        id: options.id || ("vjs_" + options.kind + "_" + options.language + "_" + _V_.guid++),

        src: options.src,

        // If default is used, subtitles/captions to start showing
        "default": options["default"], // 'default' is reserved-ish
        title: options.title,

        // Language - two letter string to represent track language, e.g. "en" for English
        // readonly attribute DOMString language;
        language: options.srclang,

        // Track label e.g. "English"
        // readonly attribute DOMString label;
        label: options.label,

        // All cues of the track. Cues have a startTime, endTime, text, and other properties.
        // readonly attribute TextTrackCueList cues;
        cues: [],

        // ActiveCues is all cues that are currently showing
        // readonly attribute TextTrackCueList activeCues;
        activeCues: [],

        // ReadyState describes if the text file has been loaded
        // const unsigned short NONE = 0;
        // const unsigned short LOADING = 1;
        // const unsigned short LOADED = 2;
        // const unsigned short ERROR = 3;
        // readonly attribute unsigned short readyState;
        readyState: 0,

        // Mode describes if the track is showing, hidden, or disabled
        // const unsigned short OFF = 0;
        // const unsigned short HIDDEN = 1; (still triggering cuechange events, but not visible)
        // const unsigned short SHOWING = 2;
        // attribute unsigned short mode;
        mode: 0
      });
    },

    // Create basic div to hold cue text
    createElement() {
      return this._super("div", {
        className: "vjs-" + this.kind + " vjs-text-track"
      });
    },

    // Show: Mode Showing (2)
    // Indicates that the text track is active. If no attempt has yet been made to obtain the track's cues, the user agent will perform such an attempt momentarily.
    // The user agent is maintaining a list of which cues are active, and events are being fired accordingly.
    // In addition, for text tracks whose kind is subtitles or captions, the cues are being displayed over the video as appropriate;
    // for text tracks whose kind is descriptions, the user agent is making the cues available to the user in a non-visual fashion;
    // and for text tracks whose kind is chapters, the user agent is making available to the user a mechanism by which the user can navigate to any point in the media resource by selecting a cue.
    // The showing by default state is used in conjunction with the default attribute on track elements to indicate that the text track was enabled due to that attribute.
    // This allows the user agent to override the state if a later track is discovered that is more appropriate per the user's preferences.
    show() {
      this.activate();

      this.mode = 2;

      // Show element.
      this._super();
    },

    // Hide: Mode Hidden (1)
    // Indicates that the text track is active, but that the user agent is not actively displaying the cues.
    // If no attempt has yet been made to obtain the track's cues, the user agent will perform such an attempt momentarily.
    // The user agent is maintaining a list of which cues are active, and events are being fired accordingly.
    hide() {
      // When hidden, cues are still triggered. Disable to stop triggering.
      this.activate();

      this.mode = 1;

      // Hide element.
      this._super();
    },

    // Disable: Mode Off/Disable (0)
    // Indicates that the text track is not active. Other than for the purposes of exposing the track in the DOM, the user agent is ignoring the text track.
    // No cues are active, no events are fired, and the user agent will not attempt to obtain the track's cues.
    disable() {
      // If showing, hide.
      if (this.mode == 2) { this.hide(); }

      // Stop triggering cues
      this.deactivate();

      // Switch Mode to Off
      this.mode = 0;
    },

    // Turn on cue tracking. Tracks that are showing OR hidden are active.
    activate() {
      // Load text file if it hasn't been yet.
      if (this.readyState == 0) { this.load(); }

      // Only activate if not already active.
      if (this.mode == 0) {
        // Update current cue on timeupdate
        // Using unique ID for proxy function so other tracks don't remove listener
        this.player.on("timeupdate", this.proxy(this.update, this.id));

        // Reset cue time on media end
        this.player.on("ended", this.proxy(this.reset, this.id));

        // Add to display
        if (this.kind == "captions" || this.kind == "subtitles") {
          this.player.textTrackDisplay.addComponent(this);
        }
      }
    },

    // Turn off cue tracking.
    deactivate() {
      // Using unique ID for proxy function so other tracks don't remove listener
      this.player.off("timeupdate", this.proxy(this.update, this.id));
      this.player.off("ended", this.proxy(this.reset, this.id));
      this.reset(); // Reset

      // Remove from display
      this.player.textTrackDisplay.removeComponent(this);
    },

    // A readiness state
    // One of the following:
    //
    // Not loaded
    // Indicates that the text track is known to exist (e.g. it has been declared with a track element), but its cues have not been obtained.
    //
    // Loading
    // Indicates that the text track is loading and there have been no fatal errors encountered so far. Further cues might still be added to the track.
    //
    // Loaded
    // Indicates that the text track has been loaded with no fatal errors. No new cues will be added to the track except if the text track corresponds to a MutableTextTrack object.
    //
    // Failed to load
    // Indicates that the text track was enabled, but when the user agent attempted to obtain it, this failed in some way (e.g. URL could not be resolved, network error, unknown text track format). Some or all of the cues are likely missing and will not be obtained.
    load() {

      // Only load if not loaded yet.
      if (this.readyState == 0) {
        this.readyState = 1;
        _V_.get(this.src, this.proxy(this.parseCues), this.proxy(this.onError));
      }

    },

    onError(err) {
      this.error = err;
      this.readyState = 3;
      this.trigger("error");
    },

    // Parse the WebVTT text format for cue times.
    // TODO: Separate parser into own class so alternative timed text formats can be used. (TTML, DFXP)
    parseCues(srcContent) {
      var cue;
      var time;
      var text;
      var lines = srcContent.split("\n");
      var line = "";
      var id;

      for (var i=1, j=lines.length; i<j; i++) {
        // Line 0 should be 'WEBVTT', so skipping i=0

        line = _V_.trim(lines[i]); // Trim whitespace and linebreaks

        if (line) { // Loop until a line with content

          // First line could be an optional cue ID
          // Check if line has the time separator
          if (line.indexOf("-->") == -1) {
            id = line;
            // Advance to next line for timing.
            line = _V_.trim(lines[++i]);
          } else {
            id = this.cues.length;
          }

          // First line - Number
          cue = {
            id, // Cue Number
            index: this.cues.length // Position in Array
          };

          // Timing line
          time = line.split(" --> ");
          cue.startTime = this.parseCueTime(time[0]);
          cue.endTime = this.parseCueTime(time[1]);

          // Additional lines - Cue Text
          text = [];

          // Loop until a blank line or end of lines
          // Assumeing trim("") returns false for blank lines
          while (lines[++i] && (line = _V_.trim(lines[i]))) {
            text.push(line);
          }

          cue.text = text.join('<br/>');

          // Add this cue
          this.cues.push(cue);
        }
      }

      this.readyState = 2;
      this.trigger("loaded");
    },

    parseCueTime(timeText) {
      var parts = timeText.split(':');
      var time = 0;
      var hours;
      var minutes;
      var other;
      var seconds;
      var ms;
      var flags;

      // Check if optional hours place is included
      // 00:00:00.000 vs. 00:00.000
      if (parts.length == 3) {
        hours = parts[0];
        minutes = parts[1];
        other = parts[2];
      } else {
        hours = 0;
        minutes = parts[0];
        other = parts[1];
      }

      // Break other (seconds, milliseconds, and flags) by spaces
      // TODO: Make additional cue layout settings work with flags
      other = other.split(/\s+/)
      // Remove seconds. Seconds is the first part before any spaces.
      seconds = other.splice(0,1)[0];
      // Could use either . or , for decimal
      seconds = seconds.split(/\.|,/);
      // Get milliseconds
      ms = parseFloat(seconds[1]);
      seconds = seconds[0];

      // hours => seconds
      time += parseFloat(hours) * 3600;
      // minutes => seconds
      time += parseFloat(minutes) * 60;
      // Add seconds
      time += parseFloat(seconds);
      // Add milliseconds
      if (ms) { time += ms/1000; }

      return time;
    },

    // Update active cues whenever timeupdate events are triggered on the player.
    update() {
      if (this.cues.length > 0) {

        // Get curent player time
        var time = this.player.currentTime();

        // Check if the new time is outside the time box created by the the last update.
        if (this.prevChange === undefined || time < this.prevChange || this.nextChange <= time) {
          var cues = this.cues; // Loop vars

          var // Create a new time box for this state.
          // Start at beginning of the timeline
          newNextChange = this.player.duration();

          var // Start at end
          newPrevChange = 0;

          var // Set the direction of the loop through the cues. Optimized the cue check.
          reverse = false;

          var // Store new active cues.
          newCues = [];

          var // Store where in the loop the current active cues are, to provide a smart starting point for the next loop.
          firstActiveIndex;

          var lastActiveIndex;

          var // Create cue text HTML to add to the display
          html = "";

          var cue;
          var i;
          var j;

          // Check if time is going forwards or backwards (scrubbing/rewinding)
          // If we know the direction we can optimize the starting position and direction of the loop through the cues array.
          if (time >= this.nextChange || this.nextChange === undefined) { // NextChange should happen
            // Forwards, so start at the index of the first active cue and loop forward
            i = (this.firstActiveIndex !== undefined) ? this.firstActiveIndex : 0;
          } else {
            // Backwards, so start at the index of the last active cue and loop backward
            reverse = true;
            i = (this.lastActiveIndex !== undefined) ? this.lastActiveIndex : cues.length - 1;
          }

          while (true) { // Loop until broken
            cue = cues[i];

            // Cue ended at this point
            if (cue.endTime <= time) {
              newPrevChange = Math.max(newPrevChange, cue.endTime);

              if (cue.active) {
                cue.active = false;
              }

              // No earlier cues should have an active start time.
              // Nevermind. Assume first cue could have a duration the same as the video.
              // In that case we need to loop all the way back to the beginning.
              // if (reverse && cue.startTime) { break; }

            // Cue hasn't started
            } else if (time < cue.startTime) {
              newNextChange = Math.min(newNextChange, cue.startTime);

              if (cue.active) {
                cue.active = false;
              }

              // No later cues should have an active start time.
              if (!reverse) { break; }

            // Cue is current
            } else {

              if (reverse) {
                // Add cue to front of array to keep in time order
                newCues.splice(0,0,cue);

                // If in reverse, the first current cue is our lastActiveCue
                if (lastActiveIndex === undefined) { lastActiveIndex = i; }
                firstActiveIndex = i;
              } else {
                // Add cue to end of array
                newCues.push(cue);

                // If forward, the first current cue is our firstActiveIndex
                if (firstActiveIndex === undefined) { firstActiveIndex = i; }
                lastActiveIndex = i;
              }

              newNextChange = Math.min(newNextChange, cue.endTime);
              newPrevChange = Math.max(newPrevChange, cue.startTime);

              cue.active = true;
            }

            if (reverse) {
              // Reverse down the array of cues, break if at first
              if (i === 0) { break; } else { i--; }
            } else {
              // Walk up the array fo cues, break if at last
              if (i === cues.length - 1) { break; } else { i++; }
            }

          }

          this.activeCues = newCues;
          this.nextChange = newNextChange;
          this.prevChange = newPrevChange;
          this.firstActiveIndex = firstActiveIndex;
          this.lastActiveIndex = lastActiveIndex;

          this.updateDisplay();

          this.trigger("cuechange");
        }
      }
    },

    // Add cue HTML to display
    updateDisplay() {
      var cues = this.activeCues;
      var html = "";
      var i=0;
      var j=cues.length;

      for (;i<j;i++) {
        html += "<span class='vjs-tt-cue'>"+cues[i].text+"</span>";
      }

      this.el.innerHTML = html;
    },

    // Set all loop helper values back
    reset() {
      this.nextChange = 0;
      this.prevChange = this.player.duration();
      this.firstActiveIndex = 0;
      this.lastActiveIndex = 0;
    }

  });

  // Create specific track types
  _V_.CaptionsTrack = _V_.Track.extend({
    kind: "captions"
  });

  _V_.SubtitlesTrack = _V_.Track.extend({
    kind: "subtitles"
  });

  _V_.ChaptersTrack = _V_.Track.extend({
    kind: "chapters"
  });


  /* Text Track Display
  ================================================================================ */
  // Global container for both subtitle and captions text. Simple div container.
  _V_.TextTrackDisplay = _V_.Component.extend({

    createElement() {
      return this._super("div", {
        className: "vjs-text-track-display"
      });
    }

  });

  /* Text Track Menu Items
  ================================================================================ */
  _V_.TextTrackMenuItem = _V_.MenuItem.extend({

    init(player, options) {
      var track = this.track = options.track;

      // Modify options for parent MenuItem class's init.
      options.label = track.label;
      options.selected = track["default"];
      this._super(player, options);

      this.player.on(track.kind + "trackchange", _V_.proxy(this, this.update));
    },

    onClick() {
      this._super();
      this.player.showTextTrack(this.track.id, this.track.kind);
    },

    update() {
      if (this.track.mode == 2) {
        this.selected(true);
      } else {
        this.selected(false);
      }
    }

  });

  _V_.OffTextTrackMenuItem = _V_.TextTrackMenuItem.extend({

    init(player, options) {
      // Create pseudo track info
      // Requires options.kind
      options.track = { kind: options.kind, player, label: "Off" }
      this._super(player, options);
    },

    onClick() {
      this._super();
      this.player.showTextTrack(this.track.id, this.track.kind);
    },

    update() {
      var tracks = this.player.textTracks;
      var i=0;
      var j=tracks.length;
      var track;
      var off = true;

      for (;i<j;i++) {
        track = tracks[i];
        if (track.kind == this.track.kind && track.mode == 2) {
          off = false;
        }
      }

      if (off) {
        this.selected(true);
      } else {
        this.selected(false);
      }
    }

  });

  /* Captions Button
  ================================================================================ */
  _V_.TextTrackButton = _V_.Button.extend({

    init(player, options) {
      this._super(player, options);

      this.menu = this.createMenu();

      if (this.items.length === 0) {
        this.hide();
      }
    },

    createMenu() {
      var menu = new _V_.Menu(this.player);

      // Add a title list item to the top
      menu.el.appendChild(_V_.createElement("li", {
        className: "vjs-menu-title",
        innerHTML: _V_.uc(this.kind)
      }));

      // Add an OFF menu item to turn all tracks off
      menu.addItem(new _V_.OffTextTrackMenuItem(this.player, { kind: this.kind }))

      this.items = this.createItems();

      // Add menu items to the menu
      this.each(this.items, item => {
        menu.addItem(item);
      });

      // Add list to element
      this.addComponent(menu);

      return menu;
    },

    // Create a menu item for each text track
    createItems() {
      var items = [];
      this.each(this.player.textTracks, function(track){
        if (track.kind === this.kind) {
          items.push(new _V_.TextTrackMenuItem(this.player, {
            track
          }));
        }
      });
      return items;
    },

    buildCSSClass() {
      return this.className + " vjs-menu-button " + this._super();
    },

    // Focus - Add keyboard functionality to element
    onFocus() {
      // Show the menu, and keep showing when the menu items are in focus
      this.menu.lockShowing();
      // this.menu.el.style.display = "block";

      // When tabbing through, the menu should hide when focus goes from the last menu item to the next tabbed element.
      _V_.one(this.menu.el.childNodes[this.menu.el.childNodes.length - 1], "blur", this.proxy(function(){
        this.menu.unlockShowing();
      }));
    },
    // Can't turn off list display that we turned on with focus, because list would go away.
    onBlur() {},

    onClick() {
      // When you click the button it adds focus, which will show the menu indefinitely.
      // So we'll remove focus when the mouse leaves the button.
      // Focus is needed for tab navigation.
      this.one("mouseout", this.proxy(function(){
        this.menu.unlockShowing();
        this.el.blur();
      }));
    }

  });

  _V_.CaptionsButton = _V_.TextTrackButton.extend({
    kind: "captions",
    buttonText: "Captions",
    className: "vjs-captions-button"
  });

  _V_.SubtitlesButton = _V_.TextTrackButton.extend({
    kind: "subtitles",
    buttonText: "Subtitles",
    className: "vjs-subtitles-button"
  });

  // Chapters act much differently than other text tracks
  // Cues are navigation vs. other tracks of alternative languages
  _V_.ChaptersButton = _V_.TextTrackButton.extend({
    kind: "chapters",
    buttonText: "Chapters",
    className: "vjs-chapters-button",

    // Create a menu item for each text track
    createItems(chaptersTrack) {
      var items = [];

      this.each(this.player.textTracks, function(track){
        if (track.kind === this.kind) {
          items.push(new _V_.TextTrackMenuItem(this.player, {
            track
          }));
        }
      });

      return items;
    },

    createMenu() {
      var tracks = this.player.textTracks;
      var i = 0;
      var j = tracks.length;
      var track;
      var chaptersTrack;
      var items = this.items = [];

      for (;i<j;i++) {
        track = tracks[i];
        if (track.kind == this.kind && track["default"]) {
          if (track.readyState < 2) {
            this.chaptersTrack = track;
            track.on("loaded", this.proxy(this.createMenu));
            return;
          } else {
            chaptersTrack = track;
            break;
          }
        }
      }

      var menu = this.menu = new _V_.Menu(this.player);

      menu.el.appendChild(_V_.createElement("li", {
        className: "vjs-menu-title",
        innerHTML: _V_.uc(this.kind)
      }));

      if (chaptersTrack) {
        var cues = chaptersTrack.cues;
        var i = 0;
        var j = cues.length;
        var cue;
        var mi;

        for (;i<j;i++) {
          cue = cues[i];

          mi = new _V_.ChaptersTrackMenuItem(this.player, {
            track: chaptersTrack,
            cue
          });

          items.push(mi);

          menu.addComponent(mi);
        }
      }

      // Add list to element
      this.addComponent(menu);

      if (this.items.length > 0) {
        this.show();
      }

      return menu;
    }

  });

  _V_.ChaptersTrackMenuItem = _V_.MenuItem.extend({

    init(player, options) {
      var track = this.track = options.track;
      var cue = this.cue = options.cue;
      var currentTime = player.currentTime();

      // Modify options for parent MenuItem class's init.
      options.label = cue.text;
      options.selected = (cue.startTime <= currentTime && currentTime < cue.endTime);
      this._super(player, options);

      track.on("cuechange", _V_.proxy(this, this.update));
    },

    onClick() {
      this._super();
      this.player.currentTime(this.cue.startTime);
      this.update(this.cue.startTime);
    },

    update(time) {
      var cue = this.cue;
      var currentTime = this.player.currentTime();

      // _V_.log(currentTime, cue.startTime);
      if (cue.startTime <= currentTime && currentTime < cue.endTime) {
        this.selected(true);
      } else {
        this.selected(false);
      }
    }

  });

  // Add Buttons to controlBar
  _V_.merge(_V_.ControlBar.prototype.options.components, {
    "subtitlesButton": {},
    "captionsButton": {},
    "chaptersButton": {}
  });

  // _V_.Cue = _V_.Component.extend({
  //   init: function(player, options){
  //     this._super(player, options);
  //   }
  // });// Automatically set up any tags that have a data-setup attribute
  _V_.autoSetup = () => {
    var options;
    var vid;
    var player;
    var vids = document.getElementsByTagName("video");

    // Check if any media elements exist
    if (vids && vids.length > 0) {

      for (var i=0,j=vids.length; i<j; i++) {
        vid = vids[i];

        // Check if element exists, has getAttribute func.
        // IE seems to consider typeof el.getAttribute == "object" instead of "function" like expected, at least when loading the player immediately.
        if (vid && vid.getAttribute) {

          // Make sure this player hasn't already been set up.
          if (vid.player === undefined) {
            options = vid.getAttribute("data-setup");

            // Check if data-setup attr exists. 
            // We only auto-setup if they've added the data-setup attr.
            if (options !== null) {

              // Parse options JSON
              // If empty string, make it a parsable json object.
              options = JSON.parse(options || "{}");

              // Create new video.js instance.
              player = _V_(vid, options);
            }
          }

        // If getAttribute isn't defined, we need to wait for the DOM.
        } else {
          _V_.autoSetupTimeout(1);
          break;
        }
      }

    // No videos were found, so keep looping unless page is finisehd loading.
    } else if (!_V_.windowLoaded) {
      _V_.autoSetupTimeout(1);
    }
  };

  // Pause to let the DOM keep processing
  _V_.autoSetupTimeout = wait => {
    setTimeout(_V_.autoSetup, wait);
  };

  _V_.addEvent(window, "load", () => {
    _V_.windowLoaded = true;
  });

  // Run Auto-load players
  _V_.autoSetup();
  // Expose to global
  window.VideoJS = window._V_ = VideoJS;

  // End self-executing function
}))(window);