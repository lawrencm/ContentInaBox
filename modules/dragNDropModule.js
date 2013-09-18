
var dndModule=angular.module('dnd', []);

dndModule.controller('dndctrl', function($scope) {

});


dndModule.directive('draggable', ['$http', function(){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        controller: function($scope, $element, $attrs) {

        },
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        // template: '',
        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {

            var tgstr = "#" + iAttrs['target'];

            var handleDragStart = function (e){


                $(tgstr).css({"box-shadow":"0px 0px 10px 10px  rgba(52, 152, 219, .5)","transition": "500ms linear 0s"});


                this.style.opacity = '1';

                // e.originalEvent will return the native javascript event as opposed to jQuery wrapped event
                e.originalEvent.dataTransfer.effectAllowed = 'copy';

                //creating an object for transferring data onto the droppable object
                var dataInfo = {
                    dataId:e.currentTarget.getAttribute("data-id"),
                    extraData:"this is a sample data"
                };

                //payload from the draggable object
                e.originalEvent.dataTransfer.setData('text/plain', angular.toJson(dataInfo)); // required otherwise doesn't work

            };

            var handleDragEnd = function(e){
                $(tgstr).css({"box-shadow":""});
                this.style.opacity = "1";
                e.preventDefault();
            };

            iElm.attr("draggable","true");
            iElm.bind("dragstart",handleDragStart);
            iElm.bind("dragend",handleDragEnd);
        }
    };
}]);



dndModule.directive('droppable', ['$http', function(){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        // cont­rol­ler: function($scope, $element, $attrs, $transclue) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict:'A',

        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {
                // var iElm = iElement;
                //console.log("droppable");

                var dnD = {


                    handleDropleave : function(e){
                        iElm.removeClass("over"); // for removing highlighting effect on droppable object
                    },

                    handleDragEnter : function(e) {
                        if (e.preventDefault) e.preventDefault(); // allows us to drop
                        iElm.addClass("over"); // for giving highlighting effect on droppable object
                    },

                    handleDragOver : function(e) {
                        if (e.preventDefault) e.preventDefault(); // allows us to drop
                        iElm.addClass("over"); // for giving highlighting effect on droppable object
                        return false;
                    },

                    handleDropped : function(e){
                        if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting..

                        var jsonDataStr = e.originalEvent.dataTransfer.getData('text/plain');

                        //console.log("recieved ", jsonData);
                        if(jsonDataStr){
                            var jsonData = angular.fromJson(jsonDataStr);
                            $scope.fnOnDrop(jsonData); // this will be called on the directive's parent scope
                        }
                        iElm.removeClass("over"); // for removing highlighting effect on droppable object
                        return false;
                    }
                };
                iElm.bind("dragenter",dnD.handleDragEnter);
                iElm.bind("dragover",dnD.handleDragOver);
                iElm.bind("dragleave",dnD.handleDropleave);
                iElm.bind("drop",dnD.handleDropped);

            },
        
    };
}]);

