var appConfig = angular.module("appConfig", ['forms']);


/**
 * A service that gets the basic metadata info
 * and makes it available from the rootscope
 */
appConfig.factory('$ucmMetaUtils', function ($rootScope, $ucmapi) {


    var opts = {
        IdcService: "GET_DOC_METADATA_INFO",
        IsSoap: 1
    };

    $ucmapi.get(opts, function (err, data) {
        /**
         * option list creation
         * creates all option lists as arrays in the object
         * $rootScope.optionLists
         *
         * this service has to be called as a soap request as the json
         * request does not give back all the required info. :(
         */

        $rootScope.optionLists = {};

        xmlDoc = $.parseXML(data);
        $xml = $(xmlDoc);
        //find all option lists and do stuff with them
        $xml.find("optionlist").each(function () {
            var name = $(this).attr("name"); //option list name
            //init the optionlist array
            $rootScope.optionLists[name] = [];
            //loop over and asign it to the array
            $(this).find("option").each(function () {
                $rootScope.optionLists[name].push($(this).text());
            });
        });
        //broadcast a message to all listeneres
        $rootScope.$broadcast('optionlists:loaded');

    });


    /**
     * doesnt return anything yet
     */
    return {


    };
});


/**
 * MAIN CONTROLLER FOR application
 */
appConfig.controller("appConfigCtrl", function ($scope, $rootScope, $ucmMetaUtils) {

    /**
     *
     *
     */

    $rootScope.metadataConfig = {
        fields: {
            dID: {
                type: 'string',
                label: 'Document Id',
                required: true,
                editConfig: {
                    widget: 'text'
                }
            },
            dDocName: {
                type: 'string',
                label: 'Document Name',
                required: true
            },
            dDocTitle: {
                type: 'string',
                label: 'Title',
                required: true
            },

            xContractId: {
                type: 'string',
                label: "Contract ID",
                required: true,
                rules: {
                    minlength: 3,
                    maxlength: 10
                }
            },
            xContractName: {
                type: 'string',
                label: "Contract Name",
                required: false,
                rules: {
                    minlength: 0,
                    maxlength: 100
                }
            },
            xCMOrgLevel1: {
                type: 'string',
                label: "Org Level 1",
                required: false,
                rules: {
                    minlength: 0,
                    maxlength: 100
                }
            },
            xCMOrgLevel2: {
                type: 'string',
                label: "Org Level 2",
                required: false,
                rules: {
                    minlength: 0,
                    maxlength: 100
                }
            },
            xCMOrgLevel3: {
                type: 'string',
                label: "Org Level 3",
                required: false,
                rules: {
                    minlength: 0,
                    maxlength: 100
                }
            },
            xAssetId: {
                type: 'string',
                label: "Asset ID",
                required: false
            },
            xAssetName: {
                type: 'string',
                label: "Asset Name",
                required: false
            },
            fFolderName: {
                type: "text",
                label: "Folder Name",
                placeholder: "Please enter a name for the folder",
                required:true,
                pattern:/^[\w.-]+$/,
                edit: {
                    widget: 'text'
                }
            }, //text
            fOwner: {
                type: "string",
                label: "Owner",
                icon:"icon-user",
                placeholder: "Who owns this folder",
                required:true,

                edit: {
                    widget: 'text'
                }
            }, //text
            fSecurityGroup: {
                type: "text",
                label: "Security Group",
                placeholder: "What security group does the folder belong to",

                edit: {
                    widget: 'select',
                    getOptions: function () {
                        if (typeof $rootScope.optionLists != "undefined" && "SecurityGroups" in $rootScope.optionLists) {
                            return $rootScope.optionLists.SecurityGroups;
                        } else {
                            return [];
                        }

                    }
                }
            },
            fClbraUserList: {
                type: "text",
                label: "Restricted User Group"
            },
            fClbraAliasList: {
                type: 'text',
                label: "Restricted Group Group"
            },
            fInhibitPropagation: {
                type: "boolean",
                label: "Inhibit Propogation"
            },
            fPromptForMetadata: {
                type: "boolean",
                label: "Prompt for Metadata"
            }
        },
        aspects: [

            {   id: "default",
                label: "Default Information",
                fields: [
                    {id: 'dID', config: {}},
                    {id: 'dDocName', config: {label: "altered dDocName"}},
                    {id: 'dDocTitle', config: {}}
                ],
                isGroup: true
            },

            {   id: "folderDefault",
                label: "Folder Metadata",
                fields: [
                    {id: 'fFolderName', config: {}},
                    {id: 'fOwner', config: {label: "Folder Owner22"}},
                    {id: 'fSecurityGroup', config: {}}
                ],
                isGroup: true
            },

            {
                id: "contractInformation",
                label: "Contract Information",
                fields: [
                    {id: 'xContractId', config: {}},
                    {id: 'xContractName', config: {}}
                ],
                isGroup: true
            },
            {
                id: "orgStructure",
                label: "Organisational Structure",
                fields: [
                    {id: 'xCMOrgLevel1', config: {}},
                    {id: 'xCMOrgLevel2', config: {}},
                    {id: 'xCMOrgLevel3', config: {}}

                ],
                isGroup: true
            },
            {
                id: "assetInformation",
                label: "Asset Information",
                fields: [
                    {id: 'xAssetId', config: {}},
                    {id: 'xAssetName', config: {}}


                ],
                isGroup: true
            }
        ]
    }


});

/**
 * A service for simplifying the UCM integration
 */
appConfig.factory('$ucmapi', function ($rootScope, $http) {
    var ROOT_URL = "/cs/idcplg";

    /**
     * Converts the stupid json result sets to usable objects
     * @param data - json data - stoopid UCM structure
     * @returns a nice json object
     */
    var convertResultSets = function (data) {
        var rs = {};
        for (var i in data.ResultSets) {
            rs[i] = [];
            //loop over the rows
            for (var r = 0; r < data.ResultSets[i].rows.length; r++) {
                var row = {};

                //loop over tyhe field keys and creat an object
                for (var k = 0; k < data.ResultSets[i].fields.length; k++) {
                    var key = data.ResultSets[i].fields[k];
                    row[key.name] = data.ResultSets[i].rows[r][k];
//                    console.log(row);

                }
                rs[i].push(row);
            }
        }
        return rs;
    };

    return {
        post: function (data, callback) {
            var binder = {LocalData: data};
            $http.post(ROOT_URL, binder).
                success(function (data, status, headers, config) {
                    //console.log(data, status);
                    data.ResultSets = convertResultSets(data);
                    callback(null, data);
                }).
                error(function (data, status, headers, config) {
                    //TODO add broadacst here
                    console.log("error", data);
                    callback(data, null);
                });
        },
        get: function (data, callback) {
            //construct a valig get url string
            var urlString = "";
            var count = 1;
            for (var i in data) {
                urlString += (count == 1) ? "?" : "&";
                urlString += i + "=" + data[i];
                count++;
            }

            $http.get(ROOT_URL + urlString).
                success(function (data, status, headers, config) {
                    data.ResultSets = convertResultSets(data);
                    callback(null, data);
                }).
                error(function (data, status, headers, config) {
                    //TODO add broadacst here
                    callback(data, null);
                });
        }

    };
});


