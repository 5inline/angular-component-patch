/**
 * Component monkey patch for Angular 1.3+
 * @version  1.0.6
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

				this._storeExport = storeExport;
				this._eventName = eventName;
				this._callback = callback;
				if( !this._events ) {
					this._events = [];
				}
				this._events.push({eventName:eventName,callback:callback});
			}

			function defaultLink ($scope, $elem, $attr, controller)
			{
				$scope.$on('$destroy', function ()
				{
					if( !controller._storeExport ) return;
					var store = flux.getStore(controller._storeExport);
					controller._events.forEach( function (event)
					{
						var removeMethod = event.eventName === '*' ? 'offAny' : 'off';
						var args = event.eventName === '*' ? [event.callback] : [event.eventName, event.callback];
						store[removeMethod].apply(store, args);
					});
				});
			}

			var directive = {
				bindToController: opts.bindTo || true,
				compile: opts.compile,
				controller: controller || function(){},
				controllerAs:  opts.controllerAs || name,
				link: {
					pre: defaultLink,
					post: opts.link || null 
				},
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