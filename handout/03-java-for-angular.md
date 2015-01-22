#JavaScript for Angular

Let'e begin by disecting the following example:

```javascript
	angular.module('ngcourse')

 	.controller('MainCtrl', function($scope) {
   		$scope.username = 'alice';
   		$scope.numberOfTasks = 0;
 	});
```

At a high level, this code represents an Angular module called 'ngcourse' with a single controller
called 'MainCtrl'.

##Function Chaining / Fluent interfaces

Observe an example of JavaScript chaining (also known as fluent interfaces):

```javascript
	angular.module('ngcourse').controller(...);
```
An Angular application is essentially one giant JavaScript statement where multiple functions calls
are chained together.  A module is a function and a controller is a function.

To introduce another controller, we can simple chain it to the end of the first controller:

```javascript
	angular.module('ngcourse')

 	.controller('MainCtrl', function($scope) {
   		$scope.username = 'alice';
   		$scope.numberOfTasks = 0;
 	})
 	.controller('SecondCtrl', function($scope) {
 		$scope.animal = 'dog';
 	});
```
Later on, you will see other components of Angular such as Services chained to the application.

##Higher Order Functions

In order to introduce business logic into the controller, we pass an anonymous function into the
controller function.  In this case:

```javascript
	angular.module('ngcourse')
 	
 	.controller('MainCtrl', function($scope) {...});
```
Functions are first class citizens in JavaScript, meaning that a function can be passed into another
function as a parameter, and a function can also be returned from a function.

This concept is very important as we deal with callbacks from asynchronous function calls later in 
this training.

Also note that the scope of the controller is passed into the anonymous function. This is an example
of dependency injection, which is one of the most powerful features on Angular.

##Closure

In JavaScript, a function can reside within another function.  The function has a local (function)
scope, it has access to the scope of the outer function, and it also has access to a global scope.

```javascript
	angular.module('ngcourse')

 	.controller('MainCtrl', function($scope) {
   		$scope.username = 'alice';
   		$scope.numberOfTasks = 0;
   		$scope.addTask = function() {
      		$scope.numberOfTasks += 1;
    	};
 	});
```
In this example, the function addTask has access to a local scope as well variables such as
$scope.numberOfTasks in the outer function.




