/**
 * Component monkey patch for Angular 1.3+
 * @version  1.0.0
 * {@link  https://github.com/5inline/angular-component-patch}
 * @license  MIT License 
 */
(function(window,angular) {
'use strict';

var originalModule = angular.module;
angular.module = function ()
{
	var moduleInstance = originalModule.apply(angular, arguments);

	moduleInstance.fluxComponent = function (name, controller, template, scope, opts)
	{
		opts = opts || {};
		template = template || '';

		moduleInstance.directive(name, ['$rootScope','flux', function ($rootScope, flux){

			controller.prototype.listenTo = function (storeExport, eventName, callback)
			{
				if (!callback) {
					callback = eventName;
					eventName = '*';
				}

				callback = callback.bind(this);

				var store = flux.getStore(storeExport);
				var addMethod = eventName === '*' ? 'onAny' : 'on';
				var args = eventName === '*' ? [callback] : [eventName, callback];
				store[addMethod].apply(store, args);

				this.storeExport = storeExport;
				this.eventName = eventName;
				this.callback = callback;
			}

			function defaultLink ($scope, $elem, $attr, controller)
			{
				$scope.$on('$destroy', function ()
				{
					var store = flux.getStore(controller.storeExport);
					var removeMethod = controller.eventName === '*' ? 'offAny' : 'off';
					var args = controller.eventName === '*' ? [controller.callback] : [controller.eventName, controller.callback];
					store[removeMethod].apply(store, args);
				});
			}

			var directive = {
				bindToController: opts.bindTo || true,
				compile: opts.compile,
				controller: controller || function(){},
				controllerAs:  opts.controllerAs || name,
				link: opts.link || defaultLink,
				priority: opts.priority,
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