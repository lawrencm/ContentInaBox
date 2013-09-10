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
 var METADATA_SUBSET_SMALL = ['dDocTitle','dDocName','dDocAuthor','dInDate', 'dFormat'];



var contentInaBox = angular.module('contentInaBox', []);



contentInaBox.factory('$ucmapi', function ($rootScope,$http) {
    var ROOT_URL = "/cs/idcplg";


    var convertResultSets = function(data){
        var rs = {};
        for (i in data.ResultSets){
            rs[i]= [];


            //loop over the rows
            for (r=0; r <  data.ResultSets[i].rows.length; r++){
                var row = {};

                //loop over tyhe field keys and creat an object
                for(k=0; k< data.ResultSets[i].fields.length;k++){
                    var key = data.ResultSets[i].fields[k];
                    row[key.name] =  data.ResultSets[i].rows[r][k];
//                    console.log(row);

                }

                rs[i].push(row);
            }
        }

        return rs;
    };

    return {
        post: function (data,callback) {
            $http.post(ROOT_URL, data).
                success(function(data, status, headers, config) {
                    data.ResultSets = convertResultSets(data);
                    callback(null, data);
                }).
                error(function(data, status, headers, config) {
                    //TODO add broadacst here
                    callback(data, null);
                });
        }
//        emit: function (eventName, data, callback) {
//            socket.emit(eventName, data, function () {
//                var args = arguments;
//                $rootScope.$apply(function () {
//                    if (callback) {
//                        callback.apply(socket, args);
//                    }
//                });
//            })
//        }
    };
});



//rootscope controller
contentInaBox.controller("contentInaBoxCtrl", function ($scope) {
    $scope.METADATA_SUBSET = ['dDocTitle','dDocAuthor']
});

contentInaBox.directive('getMetadefs', ['$ucmapi', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		controller: function($scope,$ucmapi, $element, $attrs) {
            var opt = {LocalData:{
                IdcService:"GET_DOC_METADATA_INFO",
                IsJson:1
            }};

            $ucmapi.post(opt,function(err,data){

                    if(err){
                        console.log("error",data);
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
		link: function($scope, iElm, iAttrs, controller) {
			
		}
	};
}]);


contentInaBox.directive('docInfo', ['$ucmapi', function(){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        // cont­rol­ler: function($scope, $element, $attrs, $transclue) {},
        controller: function($scope,$ucmapi, $element, $attrs){

            //get the full amount of metadata
            var opt = {LocalData:{
                IdcService:"DOC_INFO",
                dID:92385,
                dDocName:"CIAB_CM092385",
                IsJson:1
            }};

            $ucmapi.post(opt,function(err,data){
                if(err){
                    console.log("error",data);
                }
                $scope.LocalData = data.LocalData;
                $scope.ResultSets = data.ResultSets;
                $scope.$broadcast('docInfo:updated');

            });
        },
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        // template: '',
        templateUrl: "/partials/doc-info.html",
        replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {

        }
    };
}]);

contentInaBox.directive('docInfoPanel', ['$ucmapi', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// cont­rol­ler: function($scope, $element, $attrs, $transclue) {},
        controller: function($scope,$ucmapi, $element, $attrs){
                function metadataSubset(){
                    $scope.metadataSubSmall = [],
                    docInfo = $scope.ResultSets.DOC_INFO[0];

                    if (docInfo){
                        for (i=0; i <METADATA_SUBSET_SMALL.length;i++){
                            var o = {};
                            o.key = METADATA_SUBSET_SMALL[i];
                            o.val = docInfo[METADATA_SUBSET_SMALL[i]];
                            $scope.metadataSubSmall.push(o);
                        }
                    }
                };

                $scope.$on('docInfo:updated',function(){
                    console.log("docInfoUpdated")
                    metadataSubset();
                });

        },
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: function(iElm, iAttrs){
            return iAttrs.templateUrl;
        },
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
		}
	};
}]);

contentInaBox.directive('documentPreview', ['$ucmapi', function(){
	// Runs during compile

    var x = "111";

	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		controller: function($scope, $element, $attrs) {
           x = "whho";
        },
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: function(iElm,iAttrs){
            console.log(x);
            return "/partials/previews/document-preview-pdf.html";
        },
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
	        console.log("xxx");
		}
	};
}]);