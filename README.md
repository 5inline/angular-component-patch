# Angular Component Patch
Monkey patch for Angular 1.3+ component structure. Includes a separate patch to integrate with [Flux Angular](https://github.com/christianalfoni/flux-angular).

### Installation
`bower install angular-component-patch`

```
<script src="[path]/angular.js"></script>
<script src="[path]/bower_components/angular-component-patch/dist/component-patch.js"></script>
```

#### Concept
Allows you to create *components* using the format:
```
angular.module('myModule').component('componentName', componentControllerFunction);

function componentControllerFunction(){ }
```

This is the equivalent of creating a directive like:
```
angular.module('myModule').directive(
    function componentDirective ()
    {
      return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'components/component-name/component-name.html',
        controller: componentControllerFunction,
        controllerAs: 'componentName'
      }
    }
);
```

#### Options
Most of the normal directive properties can be added via arguments to the component function, but, at a certain point, it may just be better to use a directive. Options can be passed to override the default `component` directive properties.

```
angular.module('myModule').component('componentName', componentControllerFunction, [template], [scope], [opts])
```
#### Parameters
* **controllerFunction** `Function` - the controller function.
* **template** `String` - can be markup or a url path. Component will look for `.html` in the template to determine whether to use `template` or `templateUrl` in the directive.
* **scope** `Object` - normal Angular `scope` properties passed to the directive.
* **opts** `Object` - overrides and additions to the normal directive. 
  * Available options: `controllerAs`,`link`,`priority`,`restrict`,`replace`,`transclude` 

#### Folder Structure
Designed around my typical folder structure of:
```
-- app
  |- components
   |- component-name
        component-name.js
        component-name.html
```

## Flux
There is a flux component available that integrates directly with [Flux Angular](https://github.com/christianalfoni/flux-angular) to create easy *flux components*. The main difference is the inclusion of a `listenTo` function prototype to connect Flux Angular. It also creates a default `link` function to watch for `$scope.$on('destroy')` to clean up the Flux Listeners.

### Installation
```
<script src="[path]/angular.js"></script>
<script src="[path]/bower_components/angular-component-patch/dist/flux-component-patch.js"></script>
```

#### Example
```
angular.module('myModule').fluxComponent('myFluxComponent', myFluxController, [template], [scope], [opts]);

myFluxController.$inject = ['flux','myStore'];
function myFluxController (flux, myStore)
{
  // Listener
  this.listenTo(myStore, 'myEvent', myFunction);
  
  // Function
  function myFunction (data)
  {
    // Do Something on myEvent
  }
}
```
