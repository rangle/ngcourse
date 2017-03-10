# Part 13: Advanced Form Validation

AngularJS provides a lot of built-in functionality to improve the user
experience around HTML form validation.  Using the two-way binding features of
`ng-model`, telling the user about invalid form data is quick and easy.

## Initial Prep

Make sure your index.html only has ui-view in it. It should look something like this:

```html
  <body ng-app="ngcourse">
    ...
    <div>
      <div ui-view></div>
    </div>
    ...
    <script src="/node_modules/lodash/dist/lodash.js"></script>
```

Let's add a basic login UI to this course.  Create a `main.html` at `app/components/main/main.html` with the following markup:

```html
<div>
  <form
    ng-controller="LoginFormCtrl as loginForm"
    class="login"
    name="loginForm.form"
    novalidate>

    Enter username: <input
      ng-model="loginForm.username"
      name="username"
      required>
    <br>

    Password: <input
      type="password"
      ng-model="loginForm.password"
      name="password"
      required>
    <br>

    <button
      ng-click="main.login(loginForm.username, loginForm.password)"
      ng-disabled="loginForm.form.$invalid">Login</button>
  </form>
</div>
```

Also, to prepare for sharing information across services, lets update our user service in `client/app/core/users/users-service.js`:

```
angular.module('ngcourse.users', [])

.factory('users', function () {
  var service={};

  service.username= null;
  service.password= null;
  service.login= function(name, password){
    service.username=name;
    service.password=password;
  };
  return service;
});
```

and our app.js:

```
angular.module('ngcourse', [
  'ngcourse.tasks',
  'ngcourse.server',
  'ngcourse.router',
  'ngcourse.users'
])
.run(function ($log) {
  $log.info('Ready to go.');
});
```

and update our router-service to load the main form. We are adding the .state 'home' and changing .otherwise to '/':

```
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(false);

    $stateProvider
      .state('home', {
        url: '/',
        controller: 'MainCtrl as main',
        templateUrl: '/app/components/main/main.html'
      })
      .state('tasks', {
        url: '/tasks',
        controller: 'TaskListCtrl as taskList',
        templateUrl: '/app/sections/task-list/task-list.html'
    })
```

with the rest of the file remaining the same.

Finally, let's update our login function in our MainCtrl to transition our state by adding $stage.go('tasks'):

```
    vm.login = function(username, password) {
      vm.isAuthenticated = true;
      vm.username = username;
      vm.password=password;
      $state.go('tasks');
    };
```

Don't forget to inject $state into the controller.

## Disabling Login for Missing Data

* We've converted the `<div>` to an HTML `<form>` with the `novalidate` attribute
* We've given the form a `name`; this causes Angular to begin tracking validation
state for the form fields.
* We've also named the input fields and marked them as `required`.

AngularJS now gives us a controller variable, called `form`, which contains the
results of validating each field and the form itself.  Try sticking the
following expressions in after the `<button>` element:

```html
<p>
  Is form valid: {{ !loginForm.form.$invalid }}<br>
  Is username valid: {{ !loginForm.form.username.$invalid }}<br>
  Is password valid: {{ !loginForm.form.password.$invalid }}
</p>
```

Here, we're using the built-in validator for `required`.  However,
AngularJS also provides several other validators for use with `<input>`
elements, including:

* ng-minlength
* ng-maxlength
* ng-pattern

Here's an example that restricts the username to lower-case letters only, using
a regular expression:

```html
Enter username: <input
  ng-model="loginForm.username"
  name="username"
  ng-pattern="/^[a-z]+$/"
  required><br>
```

Node that we now have two validators on this field: `required` and `ng-pattern`.
If you need to know which one failed, you can do this:

```html
<p>{{ loginForm.form.username.$error }}</p>
```

## An Important Caveat

Note that AngularJS is a client-side technology.  The client is an inherently
untrusted environment: a malicious end user can bypass any of the input
validation by messing around with the browser.

This means that __login and data validation always needs to be enforced on
the server side!__

AngularJS's form features are there to give you the tools to make the end-user
experience better, not to enforce security constraints.

## Providing UI Cues for Missing Data

In addition to built-in validators, AngularJS also gives you some CSS classes
that you can use to provide UI cues when there's a problem with
the form.

Some examples include:

* ng-valid: the model is valid
* ng-invalid: the model is invalid
* ng-pristine: the control hasn't been interacted with yet
* ng-dirty: the control has been interacted with
* ng-touched: the control has been blurred
* ng-untouched: the control hasn't been blurred

See the [AngularJS docs](https://docs.angularjs.org/guide/forms) for a complete
list.

Let's hook some of these up to highlight fields when the user enters bad data.

Copy the following into `client/css/styles.css` and see what happens:

```css
.login input.ng-invalid.ng-touched {
  background-color: #FDD;
}

.login input.ng-valid.ng-touched {
  background-color: #DFD;
}
```

Here, we're assigning a custom background colour to each input box based on
data validity and whether the user has moved focus away from the control.

## HTML5 Input Types

HTML5 provides some additional input types, like `number`, `url`, `email`, etc.
AngularJS has built-in validation for them.  Give this a try:

```html
Email: <input type="email" name="email" ng-model="loginForm.email">
</input><br>

<span ng-show="loginForm.form.email.$invalid">
  Please enter a valid email address.
</span>
```