/*
 * jQuery postMessage Transport Plugin 1.1.1
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/* global define, window, document */

((factory => {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define(['jquery'], factory);
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
})($ => {
    'use strict';

    var counter = 0;

    var names = [
        'accepts',
        'cache',
        'contents',
        'contentType',
        'crossDomain',
        'data',
        'dataType',
        'headers',
        'ifModified',
        'mimeType',
        'password',
        'processData',
        'timeout',
        'traditional',
        'type',
        'url',
        'username'
    ];

    var convert = p => p;

    $.ajaxSetup({
        converters: {
            'postmessage text': convert,
            'postmessage json': convert,
            'postmessage html': convert
        }
    });

    $.ajaxTransport('postmessage', options => {
        if (options.postMessage && window.postMessage) {
            var iframe;
            var loc = $('<a>').prop('href', options.postMessage)[0];
            var target = loc.protocol + '//' + loc.host;
            var xhrUpload = options.xhr().upload;
            return {
                send(_, completeCallback) {
                    counter += 1;

                    var message = {
                            id: 'postmessage-transport-' + counter
                        };

                    var eventName = 'message.' + message.id;
                    iframe = $(
                        '<iframe style="display:none;" src="' +
                            options.postMessage + '" name="' +
                            message.id + '"></iframe>'
                    ).bind('load', () => {
                        $.each(names, (i, name) => {
                            message[name] = options[name];
                        });
                        message.dataType = message.dataType.replace('postmessage ', '');
                        $(window).bind(eventName, e => {
                            e = e.originalEvent;
                            var data = e.data;
                            var ev;
                            if (e.origin === target && data.id === message.id) {
                                if (data.type === 'progress') {
                                    ev = document.createEvent('Event');
                                    ev.initEvent(data.type, false, true);
                                    $.extend(ev, data);
                                    xhrUpload.dispatchEvent(ev);
                                } else {
                                    completeCallback(
                                        data.status,
                                        data.statusText,
                                        {postmessage: data.result},
                                        data.headers
                                    );
                                    iframe.remove();
                                    $(window).unbind(eventName);
                                }
                            }
                        });
                        iframe[0].contentWindow.postMessage(
                            message,
                            target
                        );
                    }).appendTo(document.body);
                },
                abort() {
                    if (iframe) {
                        iframe.remove();
                    }
                }
            };
        }
    });
}));
