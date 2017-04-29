/*
 * jQuery File Upload jQuery UI Plugin 8.7.1
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/* jshint nomen:false */
/* global define, window */

((factory => {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define(['jquery', './jquery.fileupload-ui.js'], factory);
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
})($ => {
    'use strict';

    $.widget('blueimp.fileupload', $.blueimp.fileupload, {

        options: {
            processdone(e, data) {
                data.context.find('.start').button('enable');
            },
            progress(e, data) {
                if (data.context) {
                    data.context.find('.progress').progressbar(
                        'option',
                        'value',
                        parseInt(data.loaded / data.total * 100, 10)
                    );
                }
            },
            progressall(e, data) {
                var $this = $(this);
                $this.find('.fileupload-progress')
                    .find('.progress').progressbar(
                        'option',
                        'value',
                        parseInt(data.loaded / data.total * 100, 10)
                    ).end()
                    .find('.progress-extended').each(function () {
                        $(this).html(
                            ($this.data('blueimp-fileupload') ||
                                    $this.data('fileupload'))
                                ._renderExtendedProgress(data)
                        );
                    });
            }
        },

        _renderUpload(func, files) {
            var node = this._super(func, files);
            var showIconText = $(window).width() > 480;
            node.find('.progress').empty().progressbar();
            node.find('.start').button({
                icons: {primary: 'ui-icon-circle-arrow-e'},
                text: showIconText
            });
            node.find('.cancel').button({
                icons: {primary: 'ui-icon-cancel'},
                text: showIconText
            });
            if (node.hasClass('fade')) {
                node.hide();
            }
            return node;
        },

        _renderDownload(func, files) {
            var node = this._super(func, files);
            var showIconText = $(window).width() > 480;
            node.find('.delete').button({
                icons: {primary: 'ui-icon-trash'},
                text: showIconText
            });
            if (node.hasClass('fade')) {
                node.hide();
            }
            return node;
        },

        _startHandler(e) {
            $(e.currentTarget).button('disable');
            this._super(e);
        },

        _transition(node) {
            var deferred = $.Deferred();
            if (node.hasClass('fade')) {
                node.fadeToggle(
                    this.options.transitionDuration,
                    this.options.transitionEasing,
                    () => {
                        deferred.resolveWith(node);
                    }
                );
            } else {
                deferred.resolveWith(node);
            }
            return deferred;
        },

        _create() {
            this._super();
            this.element
                .find('.fileupload-buttonbar')
                .find('.fileinput-button').each(function () {
                    var input = $(this).find('input:file').detach();
                    $(this)
                        .button({icons: {primary: 'ui-icon-plusthick'}})
                        .append(input);
                })
                .end().find('.start')
                .button({icons: {primary: 'ui-icon-circle-arrow-e'}})
                .end().find('.cancel')
                .button({icons: {primary: 'ui-icon-cancel'}})
                .end().find('.delete')
                .button({icons: {primary: 'ui-icon-trash'}})
                .end().find('.progress').progressbar();
        },

        _destroy() {
            this.element
                .find('.fileupload-buttonbar')
                .find('.fileinput-button').each(function () {
                    var input = $(this).find('input:file').detach();
                    $(this)
                        .button('destroy')
                        .append(input);
                })
                .end().find('.start')
                .button('destroy')
                .end().find('.cancel')
                .button('destroy')
                .end().find('.delete')
                .button('destroy')
                .end().find('.progress').progressbar('destroy');
            this._super();
        }

    });

}));
