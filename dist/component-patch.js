/**
 * Component monkey patch for Angular 1.3+
 * @version  1.0.9
 * {@link  https://github.com/5inline/angular-component-patch}
 * @license  MIT License 
 */
(function(window,angular) {
'use strict';

var originalModule = angular.module;
angular.module = function ()
{
	var moduleInstance = originalModule.apply(angular, arguments);
	moduleInstance.component = function (name, controller, template, scope, opts)
	{
		opts = opts || {};
		template = template || '';

		moduleInstance.directive(name, [function (){

			var directive = {
				bindToController: true,
				compile: opts.compile,
				controller: controller || function(){},
				controllerAs:  opts.controllerAs || name,
				link: opts.link,
				priority: opts.priority || 0,
				restrict: opts.restrict || 'EA',
				replace: opts.replace || true,
				scope: scope || {},
				transclude: opts.transclude || false,
			}

			if( template.indexOf('.html') > -1 ) {
				directive.templateUrl = template;
			} else {
				directive.template = template;
			}

			if( !template || template === '' ) {
				var dashName = dasher(name);
				directive.templateUrl = './components/'+ dashName +'/'+ dashName +'.html';
			}

			return directive;
		}]);
	}

	function dasher(str) {
		return str.replace(/([A-Z])/g, function ($1) {
			return '-' + $1.toLowerCase();
		});
	}

	return moduleInstance;
}

})(window,angular || global.angular);