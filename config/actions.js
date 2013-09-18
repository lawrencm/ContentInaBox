/**
 * Created with JetBrains WebStorm.
 * User: lawrencm
 * Date: 16/09/13
 * Time: 1:15 PM
 * To change this template use File | Settings | File Templates.
 */
var actionsConfig={


    folderActions:[
        {
            id: "update",
            label: "Update Folder Actions",

            action:function($scope,$ucmapi,itemInfo){
                console.log($scope);
                console.log($ucmapi);
            }
        },
        {
            id: "shortcut",
            label: "Create Shortcut"
        },
        {   id: "rename",
            label: "Rename"
        },
        {   id: "move",
            label: "Move"
        },
        {   id: "copy",
            label: "Copy"
        },
        {   id: "delete",
            label: "Delete"
        },
        {   id: "add",
            label: "Add to my folders",
            action:function($scope,$ucmapi,itemInfo){
                console.log($scope);
                console.log($ucmapi);

            }

        }
    ],

    docActions:[
        {
            id:"checkout",
            label:"Check Out",
            action:function($scope,$ucmapi,itemInfo){
                console.log("check out action called")
            }
        },
        {
            id:"update",
            label:"Update",
            action:function($scope,$ucmapi,itemInfo){
            }
        },
        {
            id:"checkinsimilar",
            label:"Check In Similar",
            action:function($scope,$ucmapi,itemInfo){
            }
        },
        {
            id:"subscribe",
            label:"Subscribe",
            action:function($scope,$ucmapi,itemInfo){
            }
        },
        {
            id:"add_to_cotent_basket",
            label:"Add to content basket",
            action:function($scope,$ucmapi,itemInfo){
            }
        }
    ]

}