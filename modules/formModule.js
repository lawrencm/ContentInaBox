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
        controller: function ($scope, $ucmapi, $element, $attrs) {

            //test data only - will eventualy come from a root scope VAR
            //TODO: hook this into a scope var
            var fid = "FLD_USER:jbloggs";
            //TODO: hook this into the metadata. an items aspects will need to be persisted in UCM
            $scope.aspects = ['folderDefault'];



            $scope.editObject = {}; // the object that will hold all data to be posted back
            $scope.editObjectMaster = {}; // a mster object to revert to if needed

            //TODO: will need to get the fid from a root scope var
            var opts = {
                IdcService: "FLD_BROWSE",
                fFolderGUID: fid,
                IsJson: 1
            };

            /**
             * get the latest folder info and assing it to a master object
             * the master object can be used to revert a form to its natural state
             */
            $ucmapi.post(opts, function (err, data) {
                $scope.editObjectMaster = angular.copy(data.ResultSets.FolderInfo[0]);
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


/**
 * Directive to get the exact config
 * for a metadata item given an aspect
 */
formModule.directive('fieldInfo', ['$http',
    function () {
        return {
            controller: function ($scope, $element, $attrs) {


            },
            templateUrl: function (iElm, iAttrs) {
                return iAttrs['fieldInfo'];
            },
            replace: true,
            link: function ($scope, iElm, iAttrs, controller) {

                $scope.getPattern = function(){
                    if(typeof $scope.mdConfig != "undefined" && "pattern" in $scope.mdConfig){
                        iElm.find("input").each(function(){
                            return $scope.mdConfig.pattern;
                        });
                    }

                    return new RegExp();
                };


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

                    $scope.editObject[$scope.field.id] = $scope.editObjectMaster[$scope.field.id] || null;


                    //if we have a pattern for this item
                    //apply it to the form element



//


                }

                $scope.$on('optionlists:loaded', function () {
                    console.log("optionlists updated");
                    updateFields();
                });
            }
        };
    }
]);