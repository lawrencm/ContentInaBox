/**
 * Created with JetBrains WebStorm.
 * User: lawrencm
 * Date: 16/09/13
 * Time: 10:18 AM
 * To change this template use File | Settings | File Templates.
 */

var browseModule = angular.module('browse', []);

browseModule.directive('breadcrumbs', ['$ucmapi', function () {
    return {
        templateUrl:"/partials/browse/breadcrumbs.html",

        controller:function($scope, $rootScope, $ucmapi, $element, $attrs) {

            console.log($rootScope.path);

            $rootScope.path = $rootScope.path || [];

            $scope.folderContentsBCClick = function(idx){
                $scope.folderId = $rootScope.path[idx].fFolderGUID;
                $rootScope.path.splice(idx+1,$rootScope.path.length-idx);
                $scope.loadPage('browse');
            };



        }
    }
}]);


/**
 * sets a perms object in the scope
 */
//browseModule.directive('checkPermissionDisplay', ['$ucmapi', function () {
//    return {
//
//        scope:{
//          user:"@user",
//          permission:"@permission",
//          icon:"@icon",
//          allow:"="
//        },
//        priority:-1,
//        controller:function($scope, $element, $attrs) {
//
//
//        },
//        replace:true,
//        template:function(iElm, iAttrs) {
//            return '<span class="perms-icon icon-{{ icon }} text-{{ class }}"></span>';
//        },
//        link: function($scope, iElm, iAttrs, controller) {
//            function updatePerms(){
//                $scope.class="muted";
//                console.log($scope.allow);
//                $scope.class = ($scope.allow)?"success":"muted";
//                switch ($scope.permission){
//                    case "R":
//                        $scope.label ="Read";
//                        break;
//                    case "W":
//                        $scope.label ="Write";
//                        break;
//                    case "D":
//                        $scope.label ="Delete";
//                        break;
//                    case "A":
//                        $scope.label ="Administer";
//                        break;
//                    default:
//                        $scope.label =$scope.permission;
//                        break;
//                }
//
//            }
//
//            $scope.$on("UpdateFolderInfo",function($rootScope){
//                console.log("XXXX hello",iAttrs);
//                console.log($scope.myPerms);
//                updatePerms();
//            })
//        }
//
//    }
//}
//]);


/**
 * sets a perms object in the scope
 */
browseModule.directive('folderInfo', ['$ucmapi', function () {
    return {
        templateUrl: function(iElm, iAttrs) {
            return iAttrs['folderInfo'];
        },

        controller:function($scope, $element, $attrs) {

            $scope.currentTemplate ="/partials/browse/folder-contents.html";

            $scope.showFolderEditForm = function(){
                $scope.currentTemplate = "/partials/browse/folder-edit-form.html";
            }

        }
    }
}
]);


browseModule.directive('folderContents', ['$ucmapi', function () {
    return {
        controller: function($scope,$rootScope,  $ucmapi, $element, $attrs) {


            $scope.setFolderId = function(id){
                $scope.folderId = id;
            };


            $scope.hasContents = function(){
                if (typeof $scope.Contents == 'undefined'){
                    return false;
                }else if ($scope.Contents.length <= 0){
                    return false
                }else{
                    return true
                }
            };

            function updateFolderView(){
                var opts = {
                    IdcService: "FLD_BROWSE",
                    fFolderGUID: $scope.folderId,
                    IsJson: 1
                };

                $ucmapi.post(opts, function (err, data) {

                    data.ResultSets

                    if(typeof data.ResultSets.FolderInfo != 'undefined'){


                        if (data.ResultSets.FolderInfo.length > 0){
                            var info = angular.copy(data.ResultSets.FolderInfo[0]);

                            $rootScope.FolderInfo = info;

                                if(typeof $rootScope.path != 'undefined'){
                                    if ($rootScope.path.length == 0 || $rootScope.path[$rootScope.path.length-1].fFolderGUID != data.ResultSets.FolderInfo[0].fFolderGUID){
                                        $rootScope.path.push(info);
                                }
                            }


                        }
                    }

//                    console.log(data);

                    $scope.Contents = angular.copy(data.ResultSets.ChildFolders);
                    if (typeof data.ResultSets.ChildFiles != 'undefined'){
                        $scope.Contents = angular.extend(data.ResultSets.ChildFiles,$scope.Contents);
                    }


                    //set perms
                    var fperms = $scope.FolderInfo.folderPermissions;
                    $rootScope.myPerms = {};
                    $rootScope.myPerms['R'] = (fperms.indexOf("R") >= 0)?true:false;
                    $rootScope.myPerms['W'] = (fperms.indexOf("W") >= 0)?true:false;
                    $rootScope.myPerms['D'] = (fperms.indexOf("D") >= 0)?true:false;
                    $rootScope.myPerms['A'] = (fperms.indexOf("A") >= 0)?true:false;


                    //get ACL info
                    //$scope.fClbraUserList = {};
                    var usrList = info.fClbraUserList.split("&");

                    $scope.clbUsrList = {};

//                    console.log(clbUsrList);

                    var rgx = /\(([^)]+)\)/;
                    for (var i = 0; i < usrList.length; i++){
                        var match = usrList[i].match(rgx);

                        if (match){
                            var uName = usrList[i].split("(")[0];

                            $scope.clbUsrList[uName] = {};
                            $scope.clbUsrList[uName]['R'] = (match[0].indexOf("R") >= 0)?true:false;
                            $scope.clbUsrList[uName]['W'] = (match[0].indexOf("W") >= 0)?true:false;
                            $scope.clbUsrList[uName]['D'] = (match[0].indexOf("D") >= 0)?true:false;
                            $scope.clbUsrList[uName]['A'] = (match[0].indexOf("A") >= 0)?true:false;

                        }

                    }



                    $rootScope.$broadcast("UpdateFolderInfo");
                })
            }

            $scope.$watch('folderId',function(n,o){
                updateFolderView();
            });

            $scope.folderId = $scope.folderId || "FLD_ROOT";

//            $scope.setFolderId($scope.folderId || "FLD_ROOT");
//            $scope.setFolderId($scope.folderId || "FLD_ROOT");

        },
        templateUrl:"/partials/browse/folder-contents.html",
//        templateUrl:function(iElm,iAttrs){
//            console.log(iAttrs["template"]);
//            return iAttrs["template"];
//        },
            link: function($scope, iElm, iAttrs, controller) {
        }
    }

}]);


