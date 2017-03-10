# Part 23: Advanced Directives

## Using the Link Function

The directive's link function is in some ways similar to the function that
defines a controller or a service.

```javascript
  .directive('ngcUser',
    function () {
      var directive = {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: '/user/user.html'
      };
      directive.link = function(scope, element, attrs) {
        ...
      };
      return directive;
    }
  )
```

There is an important caveat with the link function, however. 
This function does not do dependency injection. Instead, its arguments get
passed to it by position:

1. The first argument is the directive's scope.
2. The second argument is the directive's element.
3. The third argument is an object of attributes (we'll get to that later).

There are a few more arguments, but we'll stick with those three. Those three
arguments are passed by position, so we can call them whatever we want. By
convention, we call them "scope", "element" and "attrs".

## Dependency Injection and Link Function

If we do want to do dependency injection with a directive that uses link function
(and we usually do), we can do that using the function defining the directive:

```javascript
  .directive('ngcUser',
    function (users) {
      ...
    }
  );
```

This way 'users' service will be injected and available throughout the
directive, including inside the controller function.

## Attribute Processing with Link Function

It's important to remember, though, that we do not _have_ to map attributes to
directive's scope elements. Instead, our directive can just access attribute
values directly from the `attrs` argument:

```javascript
  directive.scope = {};
  directive.link = function(scope, element, attrs){
    var username = attrs.username;
  };
```

## Using the Compile Function

You will rarely need to use directive's `compile()` and most examples of using
it a rather contrived. Let's consider one use case for completeness.

Suppose we want to clone the widget created by the directive a number of
times, where the number would be specified in an attribute:

```html
  <ngc-user username="{{user}}" cost="hours * rate" repeat="5"></ngc-user>
```

We can achieve this by providing a compile function which will handle the
cloning:

```javascript
  directive.compile = function (tElement, tAttrs) {
    var wrapper = angular.element('<div></div>');
    for (var i=0; i<tAttrs.repeat; i++) {
      wrapper.append(tElement.clone());
    }
    tElement.replaceWith(wrapper);
    return function (scope, iElement, iAttrs) {
      ...
      };
    };
```

## Using controller vs. link vs. compile Functions

In the vast majority of the cases it is recommended to use controllers in your
directive implementation as opposed to `link()` or `compile()` functions.

The main reasons behind this rationale is that controllers allow you to provide
a named scope for your directives using the controllerAs syntax, are easier to
unit test and conform to existing development practices established in earlier
chapters. 

## Providing Custom Validation

The built-in AngularJS form validators are simple and powerful.  But what if
you need more complex validation?

You can always build your own validator by creating a directive.  Place the
following code in a file called input-white-list-directive.js, and make
sure it's included in a `<script>` tag in `index.html`.

```JavaScript
'use strict';

angular.module('ngcourse')
  .directive('inputWhiteList', function($log) {
    return {
      require: 'ngModel',
      scope: {
        whiteList: '='
      },
      link: function(scope, element, attrs, ctrl) {
        ctrl.$validators.whiteList = function(modelValue, viewValue) {
          return (-1 !== scope.whiteList.indexOf(viewValue));
        }
      }
    }
  });
```

This directive introduces a new concept:  `require`.  Here, we are telling
angular that this directive uses functionality from the built-in 'ngModel'
directive.  This gives us access to ngModelController as the `ctrl`
parameter to our link function.

We can use this parameter to add to ngModel's list of `$validators` for any
HTML element we use this directive on.

Make the following change to your `client/app/components/main/main.html`:

```html
Enter username: <input
  ng-model="loginForm.username"
  name="username"
  input-white-list white-list="['alice', 'bob', 'dan']"><br />

<span ng-show="loginForm.form.username.$error.whiteList">
  Username must be one of 'alice', 'bob', or 'dan'.
</span><br />
```

We now have a custom validator that checks that the input matches a white list
of values.
