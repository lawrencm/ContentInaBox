/**
 * Form Module
 * a module for managing the creation of edit forms
 */
var formModule = angular.module('forms', []);


/**
 * generates the form update for folders based on the aspects list
 */
formModule.directive('folderForm', ['$ucmapi', function () {
    return {
        controller: function ($scope,$rootScope, $ucmapi, $element, $attrs) {

            //test data only - will eventualy come from a root scope VAR
            //TODO: hook this into a scope var
            var fid = "F100D233742BE5C719E19F34EC990DEE";
            //TODO: hook this into the metadata. an items aspects will need to be persisted in UCM
            $scope.aspects = ['folderDefault','defaultFolderMd'];



            $scope.editObject = {}; // the object that will hold all data to be posted back
            $scope.editObjectMaster = {}; // a mster object to revert to if needed

            //TODO: will need to get the fid from a root scope var
            var opts = {
                IdcService: "FLD_EDIT_METADATA_RULES_FORM",
                fFolderGUID: fid,
                IsJson: 1
            };

            /**
             * get the latest folder info and assing it to a master object
             * the master object can be used to revert a form to its natural state
             */
            $ucmapi.post(opts, function (err, data) {
                console.log(data);
                //persist the data clent side in the context
                $rootScope.context.folderDataMaster['FLD_EDIT_METADATA_RULES_FORM'] = angular.copy(data.LocalData);
                //doctypes to the option lists
                var dt = [];
                for (var i = 0; i < data.ResultSets.DocTypes.length; i++){
                    dt.push(data.ResultSets.DocTypes[i]['dDocType']);
                }

                $rootScope.optionLists['DocTypes'] = dt;
                
                $rootScope.$broadcast("folderMetadata:loaded");
            });


            var opts2 = {
                IdcService: "FLD_INFO",
                fFolderGUID: fid,
                IsJson: 1
            };
            $ucmapi.post(opts2, function (err, data) {
                console.log(data);
                //persist the data clent side in the context
                $rootScope.context.folderDataMaster['FLD_INFO'] = angular.copy(data.ResultSets.FolderInfo[0]);
                $rootScope.$broadcast("folderInfo:loaded");
            });            




            /**
             * gets the specific aspect from the metadataconfig for use in generating forms
             * @param aspectName the id of the aspect to get
             * @returns {*} aspect obejct;
             */
            $scope.getAspectConfig = function (aspectName) {
                for (var i = 0; i < $scope.metadataConfig.aspects.length; i++) {
                    if (aspectName == $scope.metadataConfig.aspects[i].id) {
                        return $scope.metadataConfig.aspects[i];
                        break;
                    }
                }
                return {};
            };
        }
    }
}]);


formModule.directive('myPattern', ['$http',function(){
    return {
         template: "ng-pattern=(/^[\w.-]+$/"
         // link: function ($scope,iElm, iAttrs, controller) {
         //    var x = new RegExp(/^[\w.-]+$/);
         //    iAttrs.$set("ngPattern",x);
         // }
    };



}]);


/**
 * Directive to get the exact config
 * for a metadata item given an aspect
 */
formModule.directive('fieldInfo', ['$http',
    function () {
        return {
            controller: function ($scope, $rootScope, $ucmapi, $element, $attrs) {


               

                $scope.getPattern = function(){
                    if (typeof  $scope.mdConfig != "undefined" && "pattern" in $scope.mdConfig){
                        return  $scope.mdConfig.pattern;
                    }
                    return /[\s\S]*/                   
                }



                function updateFields() {
                    //init an empty object
                    $scope.mdConfig = {};
                    //create config from aspect specific config
                    $scope.mdConfig = angular.extend($scope.field.config, $scope.mdConfig);
                    //Assign defaults to config
                    $scope.mdConfig = angular.extend($scope.metadataConfig.fields[$scope.field.id], $scope.mdConfig);

                    /**
                     * if there is a master object and an edit object
                     * apply the value of the master to the editobject
                     * TODO: needs better checking to see if the required objects exist
                     */

                    // if (typeof $rootScope.context.folderDataMaster != "undefined" && $scope.field.id in $rootScope.context.folderDataMaster['FLD_INFO']){
                    //$rootScope.context.LocalData[$scope.field.id] = $rootScope.context.folderDataMaster['FLD_INFO']['$scope.field.id'];
                    // }
                    //$scope.editObject[$scope.field.id] = $scope.editObjectMaster[$scope.field.id] || null;


                    //if we have a pattern for this item
                    //apply it to the form element

                if (typeof $scope.mdConfig.edit != "undefined"){
                   
                    // $element.find("input").each(function(){
                    //     $(this).attr("ngPattern",/^[\w.-]+$/);
                    // })

                    //$attr("ngPattern",/^[\w.-]+$/);



                    if ("optionList" in $scope.mdConfig.edit){
                        var rsName =  $scope.mdConfig.edit["optionList"];
                        var rs = $rootScope.optionLists[rsName];
                        console.log(rs);
                         var options = [];
                        for (var i = 0; i < rs.length; i++){
                                console.log(rs[i])
                                var o = {label:rs[i],value:rs[i]};
                                options.push(o);
                        }
                        $scope.options = options;

                    };
                    // for MD that uses a view - get and convert the view
                    if ("view" in $scope.mdConfig.edit){


                        var viewName = $scope.mdConfig.edit.view.viewName;
                        var rsName = $scope.mdConfig.edit.view.resultSetName;
                        var rsLabelKey = $scope.mdConfig.edit.view.labelKey;
                        var rsValueKey = $scope.mdConfig.edit.view.valueKey;

                         var opts = {
                            IdcService:"GET_SCHEMA_VIEW_VALUES",
                            schViewName:viewName,
                            IsJson:1
                        };

                        $ucmapi.post(opts,function(err, data){
                            //$scope.options =
                            var rs = data.ResultSets[rsName];

                            var options = [];
                            for (var i = 0; i < rs.length; i++){
                                var o = {label:rs[i][rsLabelKey] || rs[i][rsValueKey],value:rs[i][rsValueKey]};
                                options.push(o);
                            };

                            $scope.options = options;
                        });
                    }
                }


                }


                function updateLocalDataFolderMetadata(){

                    // console.log($scope.field.id);
                    // console.log($rootScope.context.folderDataMaster.FLD_EDIT_METADATA_RULES_FORM[$scope.field.id]);


                    if ($rootScope.context.folderDataMaster.FLD_EDIT_METADATA_RULES_FORM[$scope.field.id] != "" && typeof $rootScope.context.folderDataMaster.FLD_EDIT_METADATA_RULES_FORM[$scope.field.id] != "undefined"){
                        // console.log("setting localdata: ",$scope.field.id );
                        //  console.log($rootScope.context.LocalData );
                        $rootScope.context.LocalData[$scope.field.id] = $rootScope.context.folderDataMaster.FLD_EDIT_METADATA_RULES_FORM[$scope.field.id]
                    }
                };

                function updateLocalDataFolderInfo(){

                    if ($rootScope.context.folderDataMaster.FLD_INFO[$scope.field.id] != ""){
                        $rootScope.context.LocalData[$scope.field.id] = $rootScope.context.folderDataMaster.FLD_INFO[$scope.field.id];
                    }
                };

                $rootScope.$on('folderInfo:loaded', function () {
                    console.log("Folder Info");
                    updateLocalDataFolderInfo();
                    // updateFields();
                });       

                $rootScope.$on('folderMetadata:loaded', function () {
                    updateLocalDataFolderMetadata();
                    // updateFields();
                });       

                $rootScope.$on('optionlists:loaded', function () {
                    console.log("optionlists updated");
                    updateFields();
                });

            },
            templateUrl: function (iElm, iAttrs) {
                return iAttrs['fieldInfo'];
            },
            replace: true,
            link: function ($scope,iElm, iAttrs, controller) {

                // $scope.getPattern = function(){
                //     if(typeof $scope.mdConfig != "undefined" && "pattern" in $scope.mdConfig){
                //         iElm.find("input").each(function(){
                //             return $scope.mdConfig.pattern;
                //         });
                //     }

                //     return new RegExp();
                // };



            }
        };
    }
]);