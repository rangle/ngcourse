# Part 4: Getting Started with the Client

This course will be organized around building a collaborative task manager. We
will start by building a client app, which we will later connect to a REST
API. Our first task is to setup a simple Angular app consisting of a few
*controllers* and a few *templates*, and to understand how they fit together
via *scopes* and the *digest cycle*. We'll be making use of common built-in
directives such as `ng-model`, `ng-show`, `ng-hide`, `ng-cloak`, `ng-if`,
`ng-repeat`. We will also discuss Angular’s dependency injection and the use of
`$log` for logging.

## The Most Trivial Angular App

Let's start by setting up a really simple angular app -- so simple in fact
that it won't do anything at all. Here is what we'll put in our HTML file.

```html
  <!DOCTYPE html>
  <html>
    <head>

      <script src="/node_modules/angular/angular.js"></script>
      <link rel="stylesheet" type="text/css" href="/css/styles.css"/>
    </head>
    <body>
      <div ng-app="ngcourse">
        Hello!
      </div>
      <script src="/app/app.js"></script>
    </body>
  </html>
```

We'll also need a very simple JavaScript file - our "app":

```javascript
  angular.module('ngcourse', []);
```

## A "Classic" Controller

This app doesn't do anything at all. To make it do something remotely interesting we'll need to add a controller. We'll define the controller in a separate javascript file located at `/app/components/main/main-controller.js`:  

```javascript
  angular.module('ngcourse')

  .controller('MainCtrl', function($scope) {
    $scope.username = 'alice';
    $scope.numberOfTasks = 0;
  });
```

We already saw this code in Part 2, so we recognize JavaScript's "fluent"
chaining style and the use of a function expression in the second argument to
`controller()`.

Note the way `angular.module()` is invoked in these two files.  Let's make sure
we understand the difference.

We can now attach the controller to an element and start using the content of its scope:

```html
  <body>
    <div ng-app="ngcourse">
      <div ng-controller="MainCtrl">
        Hello, {{username}}!
        You've got {{numberOfTasks}} tasks.
      </div>
    </div>
    <script src="/app/app.js"></script>
    <script src="/app/components/main/main-controller.js"></script>
  </body>
```

Note the directory structure and the file name conventions that we are using.

## Handling Events

If we put functions onto the controller's scope, we can attach those functions to DOM events.

Adding a function:

```javascript
  .controller('MainCtrl', function($scope) {
    $scope.username = 'alice';
    $scope.numberOfTasks = 0;
    $scope.addTask = function() {
      $scope.numberOfTasks += 1;
    };
  });
```

Attaching it to an event:

```html
  <div ng-controller="MainCtrl">
    Hello, {{username}}!
    You've got {{numberOfTasks}} tasks.<br/>
    <button ng-click="addTask()">Add task</button>
  </div>
```

## Debugging 1: JSHint

Use JSHint to catch simple mistakes in your code. From the command line:

```bash
  gulp lint
```

Or configure your editor to run JSHint for you.

Once you are running JSHint, it will tell you about some of the other things
you should be doing, such as using 'use strict'.

## Debugging 2: $log

```javascript
  .controller('MainCtrl', function($scope, $log) {
    $scope.username = 'alice';
    $scope.numberOfTasks = 0;
    $scope.addTask = function() {
      $log.debug('Current number of tasks:', $scope.numberOfTasks);
      $scope.numberOfTasks += 1;
    };
  });
```

## Debugging 3: Debugger

```javascript
  .controller('MainCtrl', function($scope, $log) {
    $scope.username = 'alice';
    $scope.numberOfTasks = 0;
    $scope.addTask = function() {
      debugger
      $log.debug('Current number of tasks:', $scope.numberOfTasks);
      $scope.numberOfTasks += 1;
    };
  });
```

## Debugging 4: Using the Console

Accessing an element's scope. Inspect the element in Chrome, and $scope will be set in the console. For this to work, ensure that the Angular Batarang extension is enabled in chrome.

```javascript
  $scope.numberOfTasks = 42;  // angular.element($0).scope();
  $scope.$apply();
```

We'll talk a bit more about `$apply` later, but for now let's just note that
you will *very rarely* need to use it yourself.

## A Look at Dependency Injection (DI)

This:

```javascript
  .controller('MainCtrl', function($scope, $log) {
    $log.debug('Hello');
  });
```

ends up being equivalent to this (*note* the order of the dependencies):

```javascript
  .controller('MainCtrl', function($log, $scope) {
    $log.debug('Hello');
  });
```

And this won't work at all:

```javascript
  .controller('MainCtrl', function(myScope, myLog) {
    myLog.debug('Hello');
  });
```

How come? The magic of Function.toString()!

DI "annotation":

```javascript
  .controller('MainCtrl', ['$scope', '$log',
    function($scope, $log) {
      $log.debug('Hello');
    }
  ]);
```

In which case you can rename the variables. (Don't do this!)

```javascript
  .controller('MainCtrl', ['$scope', '$log',
    function(x, y) {
      y.debug('Hello');
    }
  ]);
```

This used to be needed due to minification. Can now be handled with the
`ng-annotate` plugin for Gulp.

## Two-Way Binding with ng-model

We can also control a scope's value from the HTML:

```html
  <div ng-controller="MainCtrl">
    Enter username: <input ng-model="username"/><br/>
    <br/>
    Hello, {{username}}!
    You've got {{numberOfTasks}} tasks
    {{ username }} has {{numberOfTasks}} tasks.<br/>
    <button ng-click="addTask()">Add task</button>
  </div>
```

However: `ng-model` is a misnomer. Do not rely on controller's scope as your
"model"!

## Adding "Watchers"

Our controller can get alerted if the value on the scope changes:

```javascript
  .controller('MainCtrl', function($scope, $log) {
    $scope.username = 'alice';
    $scope.numberOfTasks = 0;
    $scope.addTask = function() {
      $log.debug('Current number of tasks:', $scope.numberOfTasks);
      $scope.numberOfTasks += 1;
    };
    $scope.$watch('username', function(newValue, oldValue) {
      $log.info(newValue, oldValue);
    });
  });
```

However: *this is rarely useful*. We'll see better ways of handling such
things.

## Implementing "Login"

Let's add HTML to hide a login form upon login.

```html
  <div ng-controller="MainCtrl">
    <div ng-hide="isAuthenticated">
      Enter username: <input ng-model="username"/><br/>
      Password: <input type="password" ng-model="password"/><br/>
      <button ng-click="login()">Login</button>
    </div>
    <div ng-show="isAuthenticated">
      Hello, {{username}}!
      You've got {{numberOfTasks}} tasks<br/>
      <button ng-click="addTask()">Add task</button>
    </div>
  </div>
```

We'll need the following in the controller:

```javascript
  .controller('MainCtrl', function($scope, $log) {
    $scope.isAuthenticated = false;
    $scope.numberOfTasks = 0;
    $scope.login = function() {
      $scope.isAuthenticated = true;
    };
    $scope.addTask = function() {
      $scope.numberOfTasks += 1;
    };
  });
```

## Splitting Up the Controllers

This controller is getting unwieldy. Let's split it into two. Our HTML:

```html
  <div ng-controller="MainCtrl">
    <div ng-hide="isAuthenticated">
      Enter username: <input ng-model="username"/><br/>
      Password: <input type="password" ng-model="password"/><br/>
      <button ng-click="login()">Login</button>
    </div>

    <div ng-show="isAuthenticated">
      Hello, {{username}}
    </div>

    <div ng-show="isAuthenticated" ng-controller="TaskListCtrl">
      {{username}}, you've got {{numberOfTasks}} tasks<br/>
      <button ng-click="addTask()">Add task</button>
    </div>
  </div>
```

And *two* JavaScript files!

In `client/app/components/main/main-controller.js`:

```javascript
  'use strict';

  angular.module('ngcourse')

  .controller('MainCtrl', function($scope, $log) {
    $scope.isAuthenticated = false;
    $scope.login = function() {
      $scope.isAuthenticated = true;
    };
  });
```

In `client/app/sections/task-list/task-list-controller.js`:

```javascript
  'use strict';

  angular.module('ngcourse')

  .controller('TaskListCtrl', function($scope, $log) {
    $scope.numberOfTasks = 0;
    $scope.addTask = function() {
      $scope.numberOfTasks += 1;
    };
  });
```

Don't forget to insert the script include into your index.html for the new task-list controller. Your script inccludes should look like this:

```javascript
<script src="/app/app.js"></script>
<script src="/app/components/main/main-controller.js"></script>
<script src="/app/sections/task-list/task-list-controller.js"></script>
```

## Broadcasting and Catching Events.

Angular provides a system for broadcasting events and listening to them. This
system is tied to scopes. Use `$scope.$on` to subscribe to messages. The method used for sending messages depends on whether we want to communicate *up* or *down* the scope.

Let's use `$scope.$broadcast` to send a message *down* the scope system. We'll
put this in `main-controller.js`:

```javascript
  .controller('MainCtrl', function($scope, $log) {
    $scope.isAuthenticated = false;
    ...
    $scope.messageChild = function() {
      $scope.$broadcast('hello.child', {fruit: 'peaches'});
    };
    ...
  });
```

We'll subscribe to this message in `task-list-controller.js` using `$scope.$on`.

```javascript
  .controller('TaskListCtrl', function($scope, $log, $window) {
    ...
    $scope.$on('hello.child', function(event, payload) {
      $window.alert(payload.fruit);
    });
    ...
  });
```

To communicate *up* the scope, we use `$emit` instead of `$broadcast`.

```javascript
  .controller('TaskListCtrl', function($scope, $log, $window) {
    ...
    $scope.messageParent = function() {
      $scope.$emit('hello.parent', {animal: 'turtle'})
    };
    ...
  });
```

Let's also the necessary buttons into the index.html. 

- Create a button in the `MainCtrl` div block that will call the `messageChild` function. 
- Create a button in the `TaskListCtrl` div block that will call the `messageParent` function. 
- Don't forget to inject `$window` into the controller as well.

Your HTML should now look like this:

```html
<div ng-controller="MainCtrl">
  <div ng-hide="isAuthenticated">
    Enter username: <input ng-model="username" /><br/> Password: <input type="password" ng-model="password" /><br/>
    <button ng-click="login()">Login</button>
  </div>

  <div ng-show="isAuthenticated">
    Hello, {{username}}
  </div>

  <button ng-click="messageChild()">Message Child</button>

  <div ng-show="isAuthenticated" ng-controller="TaskListCtrl">
    {{username}}, you've got {{numberOfTasks}} tasks<br/>
    <button ng-click="addTask()">Add task</button>
    <button ng-click="messageParent()">Message Parent</button>
  </div>
</div>
```

## Using `$apply` and `$timeout`.

We saw this example before when using the console. 

```js
$scope.numberOfTasks = 42;
$scope.$apply();
```

We had to use `$scope.$apply` to make the update to the scope reflected in the
UI. In practice, however, you will only *very rarely* have a good reason to
use `$apply`.

To understand why `$apply` is rarely needed, let's talk a bit about Angular's
"digest cycle".

Developers sometimes use `$apply` is to "apply" changes to the scope introduced
in a function called inside `setTimeout()`. A better solution, however, is to
never use `setTimeout()` in your Angular code.

Instead, use `$timeout()`, which will call `$apply()` for you.

```js
  $timeout(function() {
    // This code will run after the current digest cycle (if any) completes.
    // When this function returns, another digest cycle will run.
  });
```

In fact, most things that can be achieved with `$apply` are better done with
`$timeout`.

## Angular's Nested Scope System Considered Harmful

Angular's nested scope make it easy to setup controller-to-controller
communication. There are three problems with this, however.

1. The nested scope system is counterintuitive and hard to debug.
2. Improper use of scope as a communication can lead to performance problems.
3. Your controllers shouldn't be talking to each other directly in the first
   place.

Of those three, the third one is often the least appreciated, but it is
actually the most important. Let's talk more about it.

Consequently, we recommend avoiding the use of `$scope` altogether.

## `$rootScope`

All Angular scopes are nested inside `$rootScope`. This means
`$rootScope.$broadcast` allows you to send messages to all scopes. This is
tempting, but it's rarely a good idea. Say no to `$rootScope`.

Unlike individual scopes, which are only available inside controllers and
directives, `$rootScope` can be dependency-injected into services. This may
seem like a reason to use it, but it's actually another reason to avoid it.

## The "Controller As" Pattern

Gives a controller's scope a name and refer to its properties using this name:

```html
  <div ng-controller="MainCtrl as main">

    <div ng-hide="main.isAuthenticated" ng-controller="LoginFormCtrl as loginForm">
      Enter username: <input ng-model="loginForm.username"/><br/>
      Password: <input type="password" ng-model="loginForm.password"/><br/>
      <div ng-show="main.errorMessage">{{ main.errorMessage}}</div>
      <button ng-click="main.login(loginForm.username, loginForm.password)">Login</button>
    </div>

    <div ng-show="main.isAuthenticated">
      Hello, {{main.username}}!
    </div>

    <div ng-show="main.isAuthenticated" ng-controller="TaskListCtrl as taskList">
      {{main.username}}, you've got {{taskList.numberOfTasks}} tasks<br/>
      <button ng-click="taskList.addTask()">Add task</button>
    </div>

  </div>
```

We'll also need to change our controllers. First, `MainCtrl`:

```javascript
  .controller('MainCtrl', function($log) {
    var vm = this;
    vm.isAuthenticated = false;
    vm.login = function(username, password) {
      vm.isAuthenticated = true;
      vm.username = username;
      vm.password=password;
    };
  });
```

Then `TaskListCtrl`:

```javascript
  .controller('TaskListCtrl', function($log) {
    var vm = this;
    vm.numberOfTasks = 0;
    vm.addTask = function() {
      vm.numberOfTasks += 1;
    };
  });
```

And a trivial `LoginFormCtrl`:

```javascript
  .controller('LoginFormCtrl', function() {
    // Let's do nothing for now.
  });
```

## What's in $scope Now?

Note that $scope is still injectable!

```javascript
  .controller('TaskListCtrl', function($scope, $log) {
    $log.debug('$scope:', $scope);
    var vm = this;
    $scope.numberOfTasks = 0;
    vm.addTask = function() {
      vm.numberOfTasks += 1;
    };
  });
```

Consider not using $scope, though.

## How Do Our Controllers Communicate Now?

How do we get data from one controller's scope into the others. One possibility:

```html
  <button ng-click="main.login(loginForm.username, loginForm.password)">Login</button>
```

But we'll see a better approach shortly.

## Iteration

When we have a list of items, we use `ng-repeat` to create identical DOM for each item.
Let's put the below HTML below the `Add Task` button. 

```html
  <table>
    <tr>
      <th>Owner</th>
      <th>Task description</th>
    </tr>
    <tr ng-repeat="task in taskList.tasks">
      <td>{{task.owner}}</td>
      <td>{{task.description}}</td>
    </tr>
  </table>
```

and add the following `tasks` array in to the `TaskListCtrl`.

```javascript
  vm.tasks = [
    {
      owner: 'alice',
      description: 'Build the dog shed.'
    },
    {
      owner: 'bob',
      description: 'Get the milk.'
    },
    {
      owner: 'alice',
      description: 'Fix the door handle.'
    }
  ];
```

Refresh your angular page in the browser, login and you should see the list of tasks. 

## Next Steps

Enough controllers for now. That not where your code should go in most cases!
Our next step will be to look at how to organize our code with using services.
