/**
 * Created with JetBrains WebStorm.
 * User: mlawrence
 * Date: 10/09/13
 * Time: 10:03 AM
 * To change this template use File | Settings | File Templates.
 */

/**
 var contentInaBox = * contentInaBox Modul;
 *
 * Description
 */

//STATIC VARS

//list of items in order yto display in small metadata subset

"use strict";

var METADATA_SUBSET_SMALL = ['dDocTitle', 'dDocName', 'dDocAuthor', 'dInDate', 'dFormat'];


var contentInaBox = angular.module('contentInaBox', ['metadata', 'dnd', 'browse', 'actions','forms']);





/*
 * angularDynamicStylesheets v0.1.0
 * Copyleft 2013 Yappli
 *
 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details.
 */
contentInaBox.service('dynamicJS', [
    '$compile',
    function ($compile) {



//            var scope = angular.element.find('head').scope();
//            console.log($('head'))

        var scope = $('head')[0].scope();

        var addJavascript = function (href) {
            if (scope.javascripts_service === undefined) {
                angular.element('head').scope().javascripts_service = [];
//                    angular.element('head').append($compile("<link data-ng-repeat='stylesheet in stylesheets_service_dynamicStylesheets' data-ng-href='{{stylesheet.href}}' rel='stylesheet' />")(scope)); // Found here : http://stackoverflow.com/a/11913182/1662766
                angular.element('head').append($compile("<script data-ng-repeat='script in javascripts_service' type='text/javascript' data-ng-href='{{script.href}}'></script>")(scope)); // Found here : http://stackoverflow.com/a/11913182/1662766

            }
            else {
                for (var i in scope.javascripts_service) {
                    if (scope.javascripts_service[i].href == href) // An url can't be added more than once
                        return;
                }
            }

            scope.javascripts_service.push({href: href});
        };

        return {
            add: addJavascript
        };
    }
]);


//rootscope controller
contentInaBox.controller("contentInaBoxCtrl", function ($scope, $rootScope) {

    $scope.METADATA_SUBSET = ['dDocTitle', 'dDocAuthor'];
    $rootScope.qs = "";

    //discussion settings
    $scope.enableDiscussions = appConfig.discussions.enableDiscussions;


    $scope.someData = "Data to be dragged";

    //for handling the data as passed after the object is dropped
    $scope.fnOnDrop = function (jsonData) {
        //do something useful with the data here.
    };

});


contentInaBox.directive('getMetadefs', ['$ucmapi', function () {
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        controller: function ($scope, $ucmapi, $element, $attrs) {
            var opt = {LocalData: {
                IdcService: "GET_DOC_METADATA_INFO",
                IsJson: 1
            }};

            $ucmapi.post(opt, function (err, data) {

                if (err) {
                    console.log("error", data);
                }

                $scope.def = data;

                console.log(data)
            });
        },
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        template: '<pre>{{ def | json}}</pre>',
        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function ($scope, iElm, iAttrs, controller) {

        }
    };
}]);

contentInaBox.directive('pageManager', ['$ucmapi', function () {
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        // cont­rol­ler: function($scope, $element, $attrs, $transclue) {},

        controller: function ($scope, $element, $attrs) {

            $scope.loadDocInfo = function (dID, dDocName) {
                //set the paramas of the active document to passed in values

                console.log("hello");

                $scope.activeDocument = {
                    dID: dID,
                    dDocName: dDocName
                };

                $scope.loadPage('docInfo');
//                    $scope.loadPage('browse');
            };

            var template = "/templates/browse.html";
            // var template = "/templates/search.html";
//                var template = "/templates/doc-info.html";
            $scope.switchMainTemplate = function () {
                return template;
            }

            $scope.loadPage = function (s) {
                console.log("loading page: " + s);
                switch (s) {
                    case "browse":
                        template = "/templates/browse.html";
                        break;
                    case "search":
                        template = "/templates/search.html";
                        break;
                    case "docInfo":
                        template = "/templates/doc-info.html";
                        break;
                    default:
                        break;
                }
                $scope.switchMainTemplate();
            };
        },

        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        template: '<div ng-include="switchMainTemplate()"></div>',
        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function ($scope, iElm, iAttrs, controller) {

        }
    };
}]);


contentInaBox.directive('simpleSearch', ['$ucmapi', function () {
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        controller: function ($scope, $rootScope, $ucmapi, $element, $attrs) {


            $scope.qs = $rootScope.qs;

            $scope.$watch('qs', function (n, o) {
                $rootScope.qs = n;
            });


            $scope.hasThumbnail = function (dID) {
                var thopts = {
                    IdcService: "GET_FILE",
                    dID: dID,
                    Rendition: "rendition:T"
                }

                return $ucmapi.post(thopts, function (err, data) {
                    if (err) {
                        return false;
                    } else {
                        return true;
                    }


                });
//
            }

            function updateSearch() {
                var opts = {
                    IdcService: "GET_SEARCH_RESULTS",
                    SortField: "dInDate",
                    SortOrder: "Desc",
                    ResultCount: 20,
                    QueryText: "<qsch>" + $scope.qs + "</qsch>",
                    ftx: 1,
                    SearchQueryFormat: "Universal",
                    MiniSearchText: $scope.qs,
                    IsJson: 1
                }

                $ucmapi.post(opts, function (err, data) {
                    console.log(data);
                    $scope.SearchResults = data.ResultSets.SearchResults;
                })
            }

            $scope.$watch('qs', function (n, o) {
                if (n.length > 3) {
                    updateSearch();
                }
            })
        },


        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        // template: '',
        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function ($scope, iElm, iAttrs, controller) {

        }
    };
}]);


//contentInaBox.directive('breadcrumbs', ['$http', function(){
//    return {
//        priority: 1,
//        controller: function ($scope, $element, $attrs) {
//
//
//            $scope.$on('docInfo:updated', function () {
//                console.log("breadcrumbs");
//                console.log($scope.DocInfo);
//            });
//
//        }
//
//
//
//    }
//}]);

contentInaBox.directive('docInfo', ['$ucmapi', function () {
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        // cont­rol­ler: function($scope, $element, $attrs, $transclue) {},
        controller: function ($scope, $ucmapi, $element, $attrs) {

            //get the full amount of metadata
            //pdftest
            var opt = {
                IdcService: "DOC_INFO",
                dID: $scope.activeDocument.dID,
                dDocName: $scope.activeDocument.dDocName,
                IsJson: 1
            };

            // image test
//            var opt = {
//                IdcService: "DOC_INFO",
//                dID: 90984,
//                dDocName: "CIAB_CM090984",
//                IsJson: 1
//            };

            $ucmapi.post(opt, function (err, data) {
                if (err) {
                    console.log("error", data);
                } else {
                    $scope.LocalData = data['LocalData'] || {};
                    $scope.ResultSets = data.ResultSets || {};
                    $scope.DocInfo = data.ResultSets.DOC_INFO[0] || {};
                    $scope.$broadcast('docInfo:updated');

                }


            });
        },
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        // template: '',
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function ($scope, iElm, iAttrs, controller) {

        }
    };
}]);

contentInaBox.directive('revisionHistoryPanel', ['$ucmapi', function () {
    return {
        controller: function ($scope, $element, $attrs) {
            function updateRevisionHistory() {
                $scope.RevisionHistory = $scope.ResultSets.REVISION_HISTORY;
            }

//
            $scope.$on('docInfo:updated', function () {
                updateRevisionHistory();
            });
        },
        templateUrl: function (iElm, iAttrs) {
            // console.log("xxxx");
            return iAttrs.templateUrl;
        },        // replace: true,
        link: function ($scope, iElm, iAttrs, controller) {

        }
    };
}]);

contentInaBox.directive('renditionsPanel', ['$ucmapi', function () {
    return {
        controller: function ($scope, $element, $attrs) {

            function updateRenditions() {
                //console.log($scope.ResultSets);
                $scope.Renditions = $scope.ResultSets.manifest;
            }

//
            $scope.$on('docInfo:updated', function () {
                //console.log("zzz");
                updateRenditions();
            });
        },

        templateUrl: function (iElm, iAttrs) {
            return iAttrs.templateUrl;
        },        // replace: true,

        link: function ($scope, iElm, iAttrs, controller) {

        }
    };
}]);


contentInaBox.directive('documentPreview', ['$ucmapi', function () {
    // Runs during compile


    return {
        controller: function ($scope, $compile, $filter, $element, $attrs) {
            var template = "/partials/previews/document-preview-pdf.html";
            $scope.getTemplateUrl = function () {
                if (typeof $scope.LocalData != "undefined") {
//                    console.log($scope.DocInfo);
                    if (typeof $scope.LocalData.DocUrl != "undefined") {
                        var url = $scope.LocalData.DocUrl;
                        if (url.endsWith(".pdf")) {
                            template = "/partials/previews/document-preview-pdf.html";
                        }

                        if (url.endsWith(".jpg") || url.endsWith(".gif") || url.endsWith(".png") || url.endsWith(".jpeg")) {
                            template = "/partials/previews/document-preview-image.html";
                        }

                    }
                }
                return template;
            };

            $scope.updateViewer = function () {
                console.log($scope.LocalData);
                if (typeof $scope.LocalData.DocUrl != 'undefined') {
                    var url = $scope.LocalData.DocUrl;
                    if (url.endsWith(".pdf")) {
                        url = $filter('localUrl')($scope.LocalData.DocUrl);
                        $('#viewer').attr("data-url", url);
                        var viewer = new PDFViewer($('#viewer'));
                    }
                }
            }

            $scope.$on('docInfo:updated', function () {
                $scope.getTemplateUrl();
                $scope.updateViewer();
            });

        },
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        // template: '',
        template: '<div ng-include="getTemplateUrl()"></div>',
//        templateUrl: function (iElm, iAttrs) {
//            console.log(iAttrs);
//            iAttrs.$watch(console.log("zzz"));
//            return iAttrs.previewTemplate;
//        },
        // replace: true,
        // transclude: true,
//        compile: function(tElement, tAttrs,function transclude( function(scope, cloneLinkingFn){
//            return function linking(scope, elm, attrs){}
//        })),
        link: function ($scope, $compile, iElm, iAttrs, controller) {


        }
    };
}]);


contentInaBox.directive('getComments', ['$ucmapi', function () {
    // Runs during compile
    return {
        controller: function ($scope, $ucmapi, $element, $attrs) {
                var opts = {
                    IdcService: "GET_ASSOCIATED_DISCUSSION_FILE",
                    dID: 92385
                };

                function updateComments() {
                    $ucmapi.post(opts, function (err, data) {
                        var opts2 = {
                            IdcService: "GET_FILE",
                            dID: data.LocalData.dID
                        }
                        $ucmapi.post(opts2, function (err, data) {
                            if (data) {

                                var x = data;
                                //trim whitespace from begining and end
                                x = x.trim();
                                //removelinebreaks
                                x = x.replace(/(\r\n|\n|\r)/gm, "");
                                //remove weird string
                                x = x.replace("IDCFILE1100", "");
                                //remove idoc and comments
                                x = x.replace(/<!--[\s\S]*?-->/gm, "");
                                //replace unclosed metatag
                                x = x.replace(/<meta [\s\S]*?>/gm, "");
                                x = x.replace("</html>", "");
                                //remove html comments
                                x = x.replace(/(  )/gm, "");
                                x = "<discussions>" + x + "</discussions>";


                                //parse the xml and clean the undefined string

                                var jval = xml2json($.parseXML(x));
                                jval = jval.replace("undefined", "")


                                var jsonData = JSON.parse(jval);
                                $scope.discussions = jsonData.discussions.body.discussionPosts
//                            console.log(jsonData.discussions.body)

                            }
                        })
                    });
                }


            $scope.$on('docInfo:updated', function () {
                if ($scope.enableDiscussions) {
                    updateComments();
                }
            });


        }
    }
}]);


contentInaBox.filter('localUrl', function () {
    return function (input) {
        if (input) {
            return input.replace("http://54.252.103.32:16200", "");
        }

        return input

    }
});

contentInaBox.filter('prettyDate', function () {
    return function (input) {

        function prettyDate(time) {

            //remove db timestamp
            if (time.indexOf("{ts") == 0) {
                time = time.replace("{ts '", "").replace("'}", "");
            }


            var date = new Date((time || "").replace(/-/g, "/").replace(/[TZ]/g, " ")),
                diff = (((new Date()).getTime() - date.getTime()) / 1000),
                day_diff = Math.floor(diff / 86400);

            if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31)
                return;


            return day_diff == 0 && (
                diff < 60 && "just now" ||
                    diff < 120 && "1 minute ago" ||
                    diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
                    diff < 7200 && "1 hour ago" ||
                    diff < 86400 && Math.floor(diff / 3600) + " hours ago") ||
                day_diff == 1 && "Yesterday" ||
                day_diff < 7 && day_diff + " days ago" ||
                day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago";
        }


        if (typeof input == "object") {
            return prettyDate(input['#text'])
        } else {
            return prettyDate(input);
        }


    }
});

contentInaBox.filter('prettyFileSize', function () {
    return function (input) {

        if (typeof input !== 'undefined') {
            return filesize(input);
        } else {
            return "";
        }
    };
});


/**
 * filesize
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2013 Jason Mulligan
 * @license BSD-3 <https://raw.github.com/avoidwork/filesize.js/master/LICENSE>
 * @link http://filesizejs.com
 * @module filesize
 * @version 1.10.0
 */
(function (global) {
    "use strict";

    var base = 10,
        right = /\.(.*)/,
        bit = /b$/,
        bite = /^B$/,
        zero = /^0$/,
        options;

    options = {
        all: {
            increments: [
                ["B", 1],
                ["kb", 125],
                ["kB", 1000],
                ["Mb", 125000],
                ["MB", 1000000],
                ["Gb", 125000000],
                ["GB", 1000000000],
                ["Tb", 125000000000],
                ["TB", 1000000000000],
                ["Pb", 125000000000000],
                ["PB", 1000000000000000]
            ],
            nth: 11
        },
        bitless: {
            increments: [
                ["B", 1],
                ["kB", 1000],
                ["MB", 1000000],
                ["GB", 1000000000],
                ["TB", 1000000000000],
                ["PB", 1000000000000000]
            ],
            nth: 6
        }
    };

    /**
     * filesize
     *
     * @param  {Mixed}   arg  String, Int or Float to transform
     * @param  {Mixed}   pos  [Optional] Position to round to, defaults to 2 if shrt is ommitted, or `true` for shrthand output
     * @param  {Boolean} bits [Optional] Determines if `bit` sizes are used for result calculation, default is true
     * @return {String}       Readable file size String
     */

    function filesize(arg) {
        var result = "",
            bits = true,
            skip = false,
            i, neg, num, pos, shrt, size, sizes, suffix, z;

        // Determining arguments
        if (arguments[3] !== undefined) {
            pos = arguments[1];
            shrt = arguments[2];
            bits = arguments[3];
        } else {
            typeof arguments[1] === "boolean" ? shrt = arguments[1] : pos = arguments[1];

            if (typeof arguments[2] === "boolean") {
                bits = arguments[2];
            }
        }

        if (isNaN(arg) || (pos !== undefined && isNaN(pos))) {
            throw new Error("Invalid arguments");
        }

        shrt = (shrt === true);
        bits = (bits === true);
        pos = shrt ? 1 : (pos === undefined ? 2 : parseInt(pos, base));
        num = Number(arg);
        neg = (num < 0);

        // Flipping a negative number to determine the size
        if (neg) {
            num = -num;
        }

        // Zero is now a special case because bytes divide by 1
        if (num === 0) {
            if (shrt) {
                result = "0";
            } else {
                result = "0 B";
            }
        } else {
            if (bits) {
                sizes = options.all.increments;
                i = options.all.nth;
            } else {
                sizes = options.bitless.increments;
                i = options.bitless.nth;
            }

            while (i--) {
                size = sizes[i][1];
                suffix = sizes[i][0];

                if (num >= size) {
                    // Treating bytes as cardinal
                    if (bite.test(suffix)) {
                        skip = true;
                        pos = 0;
                    }

                    result = (num / size).toFixed(pos);

                    if (!skip && shrt) {
                        if (bits && bit.test(suffix)) {
                            suffix = suffix.toLowerCase();
                        }

                        suffix = suffix.charAt(0);
                        z = right.exec(result);

                        if (suffix === "k") {
                            suffix = "K";
                        }

                        if (z !== null && z[1] !== undefined && zero.test(z[1])) {
                            result = parseInt(result, base);
                        }

                        result += suffix;
                    } else if (!shrt) {
                        result += " " + suffix;
                    }
                    break;
                }
            }
        }

        // Decorating a 'diff'
        if (neg) {
            result = "-" + result;
        }

        return result;
    }

    // CommonJS, AMD, script tag
    if (typeof exports !== "undefined") {
        module.exports = filesize;
    } else if (typeof define === "function") {
        define(function () {
            return filesize;
        });
    } else {
        global.filesize = filesize;
    }
})(this);


String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
