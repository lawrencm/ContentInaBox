var metadataModule = angular.module('metadata', []);

metadataModule.controller('metadata', function($scope) {

});



metadataModule.directive('metadata', ['$http',
	function() {
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			// scope: {}, // {} = isolate, true = child, false/undefined = no change
			controller: function($scope,$rootScope, $element, $attrs) {

				$rootScope.testDocInfo = {
					metadataAspects: ['default', 'orgStructure', 'folderDefault', 'contractInformation']
				};

				$scope.fnOnDrop = function(data){
				    $rootScope.testDocInfo.metadataAspects.push(data);
				    $rootScope.$apply();
				};
				
			},

			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			templateUrl: function(iElm, iAttrs) {
				var template;
				switch (iAttrs['metadata']) {
					case 'info-panel':
						template = "/partials/metadata/info-panel.html";
						break;
					default:
						template = "/partials/metadata/info.html";
						break;
				}

				return template;
			},
			replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				console.log("metadata");
				console.log(iAttrs.metadata);
			}
		};
	}
]);



metadataModule.directive('metadataFieldInfo', ['$http',
	function() {
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			// scope: {}, // {} = isolate, true = child, false/undefined = no change
			controller: function($scope, $element, $attrs) {
				$scope.mdConfig = {};
				//create config from aspect specific config
				$scope.mdConfig = angular.extend($scope.field.config, $scope.mdConfig);
				//Assign defaults to config
				$scope.mdConfig = angular.extend($scope.metadataConfig.fields[$scope.field.id], $scope.mdConfig);
			},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			templateUrl: function(iElm, iAttrs) {
				return iAttrs['metadataFieldInfo'];
			},
			replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {}
		};
	}
]);

metadataModule.directive('aspectList', ['$http',
	function() {
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			// scope: {}, // {} = isolate, true = child, false/undefined = no change
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			controller:function($scope,$element,$attrs){
					
					//create an addable aspects array and a non addable aspects array					
					var allAspects = angular.copy($scope.metadataConfig.aspects);
					var addableAspects = [];
					var nonAddableAspects = [];

					for (var i=0;i<allAspects.length;i++){
						if ($.inArray(allAspects[i].id,$scope.testDocInfo.metadataAspects)<0){
							addableAspects.push(allAspects[i]);
						}else{
							nonAddableAspects.push(allAspects[i]);
						}
					}
					
					$scope.addableAspects = addableAspects;
					$scope.nonAddableAspects = nonAddableAspects;

			},
			templateUrl: '/partials/metadata/aspect-list.html',
			replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			

			link: function($scope, iElm, iAttrs, controller) {
			

			}
		};
	}
]);



