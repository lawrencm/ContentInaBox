/**
 * Created with JetBrains WebStorm.
 * User: lawrencm
 * Date: 16/09/13
 * Time: 1:32 PM
 * To change this template use File | Settings | File Templates.
 */

var actionsModule = angular.module('actions',[]);


actionsModule.directive('linkMenu', ['$ucmapi', function(){
    return {
        scope:{item: '=' },

        templateUrl:"/partials/actions/button-link-actions-menu.html",

        controller: function($scope,$ucmapi, $element, $attrs) {

            //icon to apply to the  link menu
            $scope.icon=$attrs.icon;
            //the actions assigned to this type of action
            $scope.actionConfig = actionsConfig[$attrs.linkMenu];

            /**
             * calls the functiona ssigned to this action
             * @param idx the index of the action in the action config
             */
            $scope.actionClick = function(idx){
                //call the action function
                $scope.actionConfig[idx].action($scope,$ucmapi,$scope.item);
            }
    }}

}]);


actionsModule.directive('docMenuPanel', ['$ucmapi', function(){
    return {

        scope:{item: '=' },

        templateUrl:"/partials/actions/document-actions-panel-menu.html",
        controller: function($scope,$ucmapi, $element, $attrs) {

            //icon to apply to the  link menu
            $scope.icon=$attrs.icon;
            //the actions assigned to this type of action
            $scope.actionConfig = actionsConfig[$attrs.linkMenu];


            /**
             * calls the functiona ssigned to this action
             * @param idx the index of the action in the action config
             */
            $scope.actionClick = function(idx){
                //call the action function
                $scope.actionConfig[idx].action($scope,$ucmapi,$scope.item);
            }
        }}

}]);
