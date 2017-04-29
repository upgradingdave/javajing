/*
 * jQuery File Upload AngularJS Plugin 2.2.0
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/* jshint nomen:false */
/* global define, angular */

((factory => {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define([
            'jquery',
            'angular',
            './jquery.fileupload-image.js',
            './jquery.fileupload-audio',
            './jquery.fileupload-video',
            './jquery.fileupload-validate'
        ], factory);
    } else {
        factory();
    }
})(() => {
    'use strict';

    angular.module('blueimp.fileupload', [])

        // The fileUpload service provides configuration options
        // for the fileUpload directive and default handlers for
        // File Upload events:
        .provider('fileUpload', function () {
        var scopeEvalAsync = function (expression) {
                var scope = angular.element(this)
                        .fileupload('option', 'scope');
                // Schedule a new $digest cycle if not already inside of one
                // and evaluate the given expression:
                scope.$evalAsync(expression);
            };

        var addFileMethods = (scope, data) => {
            var files = data.files,
                file = files[0];
            angular.forEach(files, (file, index) => {
                file._index = index;
                file.$state = () => data.state();
                file.$processing = () => data.processing();
                file.$progress = () => data.progress();
                file.$response = () => data.response();
            });
            file.$submit = () => {
                if (!file.error) {
                    return data.submit();
                }
            };
            file.$cancel = () => data.abort();
        };

        var $config;
        $config = this.defaults = {
            handleResponse(e, data) {
                var files = data.result && data.result.files;
                if (files) {
                    data.scope.replace(data.files, files);
                } else if (data.errorThrown ||
                        data.textStatus === 'error') {
                    data.files[0].error = data.errorThrown ||
                        data.textStatus;
                }
            },
            add(e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var scope = data.scope;
                var filesCopy = [];
                angular.forEach(data.files, file => {
                    filesCopy.push(file);
                });
                scope.$apply(() => {
                    addFileMethods(scope, data);
                    var method = scope.option('prependFiles') ?
                            'unshift' : 'push';
                    Array.prototype[method].apply(scope.queue, data.files);
                });
                data.process(() => scope.process(data)).always(() => {
                    scope.$apply(() => {
                        addFileMethods(scope, data);
                        scope.replace(filesCopy, data.files);
                    });
                }).then(() => {
                    if ((scope.option('autoUpload') ||
                            data.autoUpload) &&
                            data.autoUpload !== false) {
                        data.submit();
                    }
                });
            },
            progress(e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                data.scope.$apply();
            },
            done(e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = this;
                data.scope.$apply(() => {
                    data.handleResponse.call(that, e, data);
                });
            },
            fail(e, data) {
                if (e.isDefaultPrevented()) {
                    return false;
                }
                var that = this;
                var scope = data.scope;
                if (data.errorThrown === 'abort') {
                    scope.clear(data.files);
                    return;
                }
                scope.$apply(() => {
                    data.handleResponse.call(that, e, data);
                });
            },
            stop: scopeEvalAsync,
            processstart: scopeEvalAsync,
            processstop: scopeEvalAsync,
            getNumberOfFiles() {
                var scope = this.scope;
                return scope.queue.length - scope.processing();
            },
            dataType: 'json',
            autoUpload: false
        };
        this.$get = [
            () => ({
                defaults: $config
            })
        ];
    })

        // Format byte numbers to readable presentations:
        .provider('formatFileSizeFilter', function () {
            var $config = {
                // Byte units following the IEC format
                // http://en.wikipedia.org/wiki/Kilobyte
                units: [
                    {size: 1000000000, suffix: ' GB'},
                    {size: 1000000, suffix: ' MB'},
                    {size: 1000, suffix: ' KB'}
                ]
            };
            this.defaults = $config;
            this.$get = () => bytes => {
                if (!angular.isNumber(bytes)) {
                    return '';
                }
                var unit = true;
                var i = 0;
                var prefix;
                var suffix;
                while (unit) {
                    unit = $config.units[i];
                    prefix = unit.prefix || '';
                    suffix = unit.suffix || '';
                    if (i === $config.units.length - 1 || bytes >= unit.size) {
                        return prefix + (bytes / unit.size).toFixed(2) + suffix;
                    }
                    i += 1;
                }
            };
        })

        // The FileUploadController initializes the fileupload widget and
        // provides scope methods to control the File Upload functionality:
        .controller('FileUploadController', [
            '$scope', '$element', '$attrs', '$window', 'fileUpload',
            ($scope, $element, $attrs, $window, fileUpload) => {
                var uploadMethods = {
                    progress() {
                        return $element.fileupload('progress');
                    },
                    active() {
                        return $element.fileupload('active');
                    },
                    option(option, data) {
                        if (arguments.length === 1) {
                            return $element.fileupload('option', option);
                        }
                        $element.fileupload('option', option, data);
                    },
                    add(data) {
                        return $element.fileupload('add', data);
                    },
                    send(data) {
                        return $element.fileupload('send', data);
                    },
                    process(data) {
                        return $element.fileupload('process', data);
                    },
                    processing(data) {
                        return $element.fileupload('processing', data);
                    }
                };
                $scope.disabled = !$window.jQuery.support.fileInput;
                $scope.queue = $scope.queue || [];
                $scope.clear = function (files) {
                    var queue = this.queue;
                    var i = queue.length;
                    var file = files;
                    var length = 1;
                    if (angular.isArray(files)) {
                        file = files[0];
                        length = files.length;
                    }
                    while (i) {
                        i -= 1;
                        if (queue[i] === file) {
                            return queue.splice(i, length);
                        }
                    }
                };
                $scope.replace = function (oldFiles, newFiles) {
                    var queue = this.queue;
                    var file = oldFiles[0];
                    var i;
                    var j;
                    for (i = 0; i < queue.length; i += 1) {
                        if (queue[i] === file) {
                            for (j = 0; j < newFiles.length; j += 1) {
                                queue[i + j] = newFiles[j];
                            }
                            return;
                        }
                    }
                };
                $scope.applyOnQueue = function (method) {
                    var list = this.queue.slice(0);
                    var i;
                    var file;
                    for (i = 0; i < list.length; i += 1) {
                        file = list[i];
                        if (file[method]) {
                            file[method]();
                        }
                    }
                };
                $scope.submit = function () {
                    this.applyOnQueue('$submit');
                };
                $scope.cancel = function () {
                    this.applyOnQueue('$cancel');
                };
                // Add upload methods to the scope:
                angular.extend($scope, uploadMethods);
                // The fileupload widget will initialize with
                // the options provided via "data-"-parameters,
                // as well as those given via options object:
                $element.fileupload(angular.extend(
                    {scope: $scope},
                    fileUpload.defaults
                )).on('fileuploadadd', (e, data) => {
                    data.scope = $scope;
                }).on('fileuploadfail', (e, data) => {
                    if (data.errorThrown === 'abort') {
                        return;
                    }
                    if (data.dataType &&
                            data.dataType.indexOf('json') === data.dataType.length - 4) {
                        try {
                            data.result = angular.fromJson(data.jqXHR.responseText);
                        } catch (ignore) {}
                    }
                }).on([
                    'fileuploadadd',
                    'fileuploadsubmit',
                    'fileuploadsend',
                    'fileuploaddone',
                    'fileuploadfail',
                    'fileuploadalways',
                    'fileuploadprogress',
                    'fileuploadprogressall',
                    'fileuploadstart',
                    'fileuploadstop',
                    'fileuploadchange',
                    'fileuploadpaste',
                    'fileuploaddrop',
                    'fileuploaddragover',
                    'fileuploadchunksend',
                    'fileuploadchunkdone',
                    'fileuploadchunkfail',
                    'fileuploadchunkalways',
                    'fileuploadprocessstart',
                    'fileuploadprocess',
                    'fileuploadprocessdone',
                    'fileuploadprocessfail',
                    'fileuploadprocessalways',
                    'fileuploadprocessstop'
                ].join(' '), (e, data) => {
                    if ($scope.$emit(e.type, data).defaultPrevented) {
                        e.preventDefault();
                    }
                }).on('remove', () => {
                    // Remove upload methods from the scope,
                    // when the widget is removed:
                    var method;
                    for (method in uploadMethods) {
                        if (uploadMethods.hasOwnProperty(method)) {
                            delete $scope[method];
                        }
                    }
                });
                // Observe option changes:
                $scope.$watch(
                    $attrs.fileUpload,
                    newOptions => {
                        if (newOptions) {
                            $element.fileupload('option', newOptions);
                        }
                    }
                );
            }
        ])

        // Provide File Upload progress feedback:
        .controller('FileUploadProgressController', [
            '$scope', '$attrs', '$parse',
            ($scope, $attrs, $parse) => {
                var fn = $parse($attrs.fileUploadProgress);

                var update = () => {
                    var progress = fn($scope);
                    if (!progress || !progress.total) {
                        return;
                    }
                    $scope.num = Math.floor(
                        progress.loaded / progress.total * 100
                    );
                };

                update();
                $scope.$watch(
                    $attrs.fileUploadProgress + '.loaded',
                    (newValue, oldValue) => {
                        if (newValue !== oldValue) {
                            update();
                        }
                    }
                );
            }
        ])

        // Display File Upload previews:
        .controller('FileUploadPreviewController', [
            '$scope', '$element', '$attrs',
            ($scope, $element, $attrs) => {
                $scope.$watch(
                    $attrs.fileUploadPreview + '.preview',
                    preview => {
                        $element.empty();
                        if (preview) {
                            $element.append(preview);
                        }
                    }
                );
            }
        ])

        .directive('fileUpload', () => ({
        controller: 'FileUploadController',
        scope: true
    }))

        .directive('fileUploadProgress', () => ({
        controller: 'FileUploadProgressController',
        scope: true
    }))

        .directive('fileUploadPreview', () => ({
        controller: 'FileUploadPreviewController'
    }))

        // Enhance the HTML5 download attribute to
        // allow drag&drop of files to the desktop:
        .directive('download', () => (scope, elm) => {
        elm.on('dragstart', e => {
            try {
                e.originalEvent.dataTransfer.setData(
                    'DownloadURL',
                    [
                        'application/octet-stream',
                        elm.prop('download'),
                        elm.prop('href')
                    ].join(':')
                );
            } catch (ignore) {}
        });
    });

}));
