#JavaScript for Angular

JavaScript is an untyped interpreted programming language that can accomodate a vast variety of 
programming paradigms.  To those who are familiar with strongly typed complied language such as
Java, AngularJS code may be difficult understand at first.

This module is intended for an audience who is new to JavaScript, or one that simply needs a 
refresher.  We will walk through the basic JavaScript constructs that make up an Angular application.

Let's begin by disecting the following example:

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
are chained together.  A module is a function and a controller is also a function.

In the above example, one controller is chained to the module.  To introduce another controller, 
we can simple chain it to the end of the first controller:

```javascript
	angular.module('ngcourse')
 	.controller('MainCtrl', function($scope) {
   	...
 	})
 	.controller('TaskListCtrl', function($scope) {
 		...
 	});
```

As an alternative, we can define the module and controllers like this:

```javascript
  var ngCourseModule  = angular.module('ngcourse');
  ngCourseModule.controller('MainCtrl', function($scope){ ... });
  ngCourseModule.controller('TaskListCtrl', function($scope){ ... });
```

This example is perhaps easier to understand to those familiar with object oriented programming.  As you 
can see, we are simply creating a module and appending controllers to it through function calls.

Later on, you will see other components of Angular such as Services chained to the application.

##Higher Order Functions

In order to introduce business logic into the controller, we pass an anonymous function into the
controller function.  In this case:

```javascript
	angular.module('ngcourse')
 	.controller('MainCtrl', function($scope) {...});
```
Functions are first class citizens in JavaScript, meaning that a function can be passed into another
function as a parameter, and a function can also be returned from a function.  In addition, functions
can be assigned to variables.

Unlike in strongly typed languages such as Java, not all functions require a name.  In this case, we have
an anonymous function passed into the controller function call.  Also note that the scope of the controller 
is passed into the anonymous function. This is an example of dependency injection, which is one of the most 
powerful features of Angular.

##Variable Scope and Closure

In JavaScript, a function can be declared within another function.  The function has a local (function)
scope, it has access to the scope of the outer function, and it also has access to a global scope.

Here is a pure JavaScript example with multiple scopes:

```javascript
var aVar = 'Global Scope';

function func() {
  var aVar = 'Function Scope'; 
  console.log('aVar in Func: ' + aVar); 

  function innerFunc() {
    var aVar = 'Inner Function Scope';
    console.log('aVar in innerFunc: ' + aVar); 
  }
};

console.log('aVar in Global: ' + aVar);
func();
```
Executing the code above will produce the following:

```
aVar in Global: Global Scope
aVar in Func: Function Scope
aVar in innerFunc: Inner Function Scope
```

Notice that there are three levels of scope: Global, Function and an Inner Function Scope.  In essence,
each function declaration creates a new scope.

You will see extensive use of inner functions in Angular:

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
The function addTask has access to the variables such as $scope.numberOfTasks in the outer function.  
This is an example of a closure, a function that captures the external context in which the function
is defined.  The context (or variables) are accessible to addTask even when the outer function completes
execution.  

It is important to note that only functions create new scope in JavaScript.  For example, there 
is no new scope introduced within a loop unless a function is declared within it.





