# Part 1: The JavaScript Toolchain

JavaScript isn't exclusive to the web browser any more.  The modern JavaScript
toolchain has tools to help you:

* build your own back-end HTTP server,
* use and distribute code modules,
* automate build and testing tasks.

In this section, we'll describe the tools that we'll be using for the
rest of the course.

## Source Control: [Git](http://git-scm.com/)

`git` is a distributed versioning system for source code.  It allows developers
to collaborate on the same codebase without stepping on each other's toes.  It
has become the de-facto source control system for open source development
because of it's decentralized model and cheap branching features.

## The Command Line

JavaScript development tools are very command-line oriented.  If you come from
a Windows background you may find this unfamiliar.  However the command-line
provides better support for automating development tasks, so it's worth getting
comfortable with it.

We will provide examples for all command-line activities required by this
course.

## Command-line JavaScript: [Node.JS](http://nodejs.org)

NodeJS is an environment that lets you write JavaScript programs that live
outside the browser.  It provides:

* the V8 JavaScript interpreter
* modules for doing OS tasks like file I/O, HTTP, etc.

## Back-End Code Sharing and Distribution: [npm](https://www.npmjs.com/)

`npm` is the "node package manager".  It installs with NodeJS, and gives you
access to a wide variety of 3rd-party JavaScript modules.

It also does dependency management for your back-end application.  You specify
module dependencies in a file called `package.json`; running `npm install`
will resolve, download and install your back-end application's dependencies.

## Front-End Code Sharing and Distribution: [bower](https://bower.io)

`bower` is very similar to nodeJS, but for the front-end part of your application.
Any frameworks or 3rd-party libraries that need to be accessible in the user's
browser will be managed by `bower`.

Similarly to `npm`, `bower` tracks dependencies in a file called `bower.json`.
Running `bower install` will resolve, download, and install them.

## Task Automation

Even though JavaScript is an interpreted language, any non-trivial JavaScript
application will have 'build-time' tasks that need to be executed as part of
deployment.  Examples include:

* minifying JavaScript code
* compiling CSS meta-languages like [less](http://lesscss.org) or [sass](http://sass-lang.com)
* running unit tests
* starting up the back-end.

For this course, we'll be using a task runner called [gulp](http://gulpjs.com/).

If you come from a java or C background, `gulp` conceptually fills the role of
`ant` or `make` (although the implementation is quite different).

At a high level, it allows you to specify 'build targets' for the various tasks
you need to automate.

`gulp` build targets are specified in a file called `Gulpfile.js`.

## Chrome

Chrome is the web browser from Google.  We will be using it for this course
because of it's cutting-edge JavaScript engine and excellent debugging tools.

Code written with AngularJS should work on any modern web browser however
(Firefox, IE9+, Chrome, Safari).


#Part 2: Introduction to JavaScript for Angular

JavaScript is a dynamic programming language that can be leveraged for a number of different
programming techniques.  JavaScript was originally designed as a client side language that 
enriches user experience in the browser, but since has evolved into a full-stack language 
with popular frameworks such as AngularJS on the client side and NodeJS on the server side.

##JavaScript Data Types

JavaScipt has five primative data types: string, number, boolean, undefined and null.  JavaScript
also has a single object data type.  Primitive data types are immutable, meaning that they cannot 
be changed.  On the other hand, objects are mutable and can be changed. 

An object could be as simple as:

```javascript
var person = {firstName: "John", lastName: "Doe"};
```
A variable in an object can be access with either the dot notation

```javascript
person.firstName;
```
As opposed to an object oriented language like Java, bracket notation is not strictly used to 
access array elements.  It can also be used to access a variable in an object:

```javascript
person['firstName'];
```

##JavaScript Scope

In JavaScript, the scope represents the variables, functions and objects you have access to.  
Note that in JavaScript, both functions and objects can be variables.

```javascript
var person = {
	firstName: "John", 
	lastName: "Doe",

	getFullName: function() {
		return firstName + ' ' + lastName;
	}
};
```

A typical JavaScript application would have both a global scope and function (local) scopes.

Global variables are defined outside of functions and can be accessed throughout the application.
Function variables can only be accessed within the function.  


##First Class Functions

In JavaScript, functions are first class citizens.  Functions can be passed into other functions
as parameters and a function can be returned from another function.

Consider this example:

```javascript
  [1, 2, 3, 4].foreach(function(x) {
  	console.log('Number found: ' + x);
  });
```

Output:

Number found: 1

Number found: 2

Number found: 3

Number found: 4

Passing functions into other functions is an important concept.  The very same technique is 
used for callbacks when making asynchronus calls.

You can think of Function Programming as an assembly line.  Data is passed from function to 
function for manipulation until the desired outcome is obtained.


##Closure

It is possible to have a function within a function.  The inner function would have access to its
own function scope, the outer function's scope and the global scope.  The inner function is known
as Closure.

Closure is an important concept if you are dealing with callbacks.




##Chaining / fluent interfaces in JavaScript

In JavaScript, method chaining is often used:

```javascript
	myObject.function1().function2().function3();
```

This allows us to simply code involving multiple method calls to the same object. A slightly
more complex example:

```javascript
    $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
      .success(function(data, status) {
        $log.info(data);
      })
      .error(function(data, status) {
        $log.error(status, data);
      });
```

##Asynchronous function calls

JavaScript is a single threaded language.  When invoking computationally expensive operations, the 
rest of the application, such as the UI, will become unresponsive.  To create responsive applications
asynchronous function calls are used.

```javascript
    $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
      .success(function(data, status) {
        $log.info(data);
        vm.tasks = data;
      });
```
In the above example, $http.get is an Asynchronous function call.  Once the call is made, the code
will continue to execute in the call stack.  The anonymous function is a call back function that is
only executed when the a successful response come back from the request.

Call backs can become very complex quickly.  An alternative to call backs is promises.


#Part 3: Introduction to the Angular Framework

Angular is an open source JavaScript application framework backed by Google.  It offers a 
client side Model-View-Controller (MVC) framework that simplies application development 
and testing.

The 5 D's of Angular:

Dry: Don't repeat yourself
Declarative
Dependency Injection
Data Binding
Designer Friendly


##Structure of Angular

Let's start by understanding how Angular is structured.  Each Angular application is a module.
The module is a container for different parts of your application including views, controllers, 
directives and services.  

Views are the visual part of your application.  Angular uses HTML as the templating
language.  Views go hand-in-hand with controllers and directives, which introduces behaviours
to the DOM.

Scope is the application model and it serves as the execution context for JavaScript
expressions.  Angular applications start with a Root Scope and all other scopes are descendants
of the Root Scope.  Scopes are hierarchial in nature, which aligns with the structure
of the DOM.  Child scope inherits properties from the parent scope.  There is also the concept
of isolated scope, which are used in directives.  Scope contains specialized methods such
as $watch that observes changes in the model.

Controllers are JavaScript functions that can be attached to one or views.  A controller 
can be attached to one or more DOM elements.  Although nested controllers across different 
levels of the DOM is possible, it is generally not recommended as it introduces complex
dependencies and make testing difficult.  We generally recommend thin controllers with 
as much business logic encapsulated in Services as possible.

Directives are markers in the HTML DOM that attaches behaviours to elements, attributes and 
CSS class.

Services are singletons that can be dependency injected into controllers, directives and
other services.  The bulk of your application's business logic should belong in Services. 
Services can be in the form of a Service, a Factory or a Provider.  More on this later.

###Dependency Injection

Dependency injection allows you to inject code dependcies into Angular components such as
Controllers and Services.  This makes your code more modular, reusable and easier to test. 
For example, you can inject your code into your unit test.


###Data Binding in Angular

Angular supports two way data binding.  For example, a variable in the controller scope can
be bound to the view and updates in the model will be reflected in the view and vice versa.


Consider this example in Angular 

```javascript
angular.module('erg')
 .controller('MainCtrl', function($scope) {
   $scope.username = 'alice';
   $scope.numberOfTasks = 0;
 });
```
The Angular module erg, has a controller MainCtrl and $scope is dependency injected into the 
controller.


