# Part 12: Custom Directives

## Built in and 3rd Party Directives

Angular's built-in directives are essential to Angular. We also have the ability to leverage 3rd party directives to add additional behaviour to our code.

## Beware Bad Directives

Do watch out for poorly thought out 3rd party directives that aim to provide
an Angular style wrapper around popular libraries. When not written properly,
such directives can lead to severe performance degradation compared to using
the library directly.

## Developing Your Own Directives: When Should You Do It?

When should you develop your own custom directives? Before we consider that,
we need to clarify what we are comparing directives to.

Directives may sometimes seem cleaner than "fat" controllers, that is
controllers that contain a lot of logic. However, you should not be writing
"fat" controllers in the first place.

Directives may also seem to provide better encapsulation compared to
controllers with nested scopes. However, you should usually avoid controllers
with nested scopes and instead use "controller as" pattern.

What we want to focus on is whether we should use directives instead of
writing "good" controllers.

##  Case 1: Reuse

Consider using directives when the same markup is repeated multiple times.

However, keep in mind that some alternative solutions to repeated markup could
work better. Those include:

* Using less HTML and relying more on CSS.
* Using `ng-repeat` in combination with `ng-if` or `ng-switch`.
* Using `ng-include` when you do not actually need isolation.
* Using UI-Router's nested views for elements that need to be included on multiple pages.

## Case 2: DOM Manipulation

Directives give you access to the DOM element and manipulating DOM from the
directive is usually considered to be a better practice than doing so from a
controller. (Though, you _can_ also do this from a controller.)

Keep in mind that heavy-duty DOM manipulation should actually be offloaded to
services. What's important to avoid is services that query for elements
jQuery-style. Writing services dedicated to providing methods that take DOM
elements as an arguments and perform specific manipulations on those elements,
is often better than manipulating DOM directly in the directive.

## Case 3: Encapsulation

The most important use of directives is to provide a high degree of
encapsulation. Beware, however, directives that create an _illusion_ of
encapsulation without delivering any of its benefits.

Consider an integrated design where controllers inherit scopes:

```html
  <div ng-controller="EditorCtrl">
    <div ng-controller="DeleteDialogCtrl">
      <ul ng-controller="ContentCtrl">
        <li ng-repeat="item in items">
          {{item.name}}
          <button ng-click="edit(item)">
            Edit
          </button>
          <button ng-click="showDeleteDialog(item)">
            Delete
          </button>
        </li>
      </ul>
    </div>
  </div>
```

The following design may seem "cleaner" at first:

```html
  <div ng-controller="EditorCtrl">
    <div ng-controller="DeleteDialogCtrl">
      <ul ng-controller="ContentCtrl">
        <li ng-repeat="item in items" my-item-directive="{{item}}">
        </li>
      </ul>
    </div>
  </div>
```

However, in reality, the implementation of `my-item-directive` would need to
make assumptions about scope. This directive just sweeps the messy design
under the rug.

Directives are most useful when they can be fairly isolated and make few
assumptions about the context in which they are dropped.

## Defining a Really Basic Directive

```javascript
  .directive('ngcUser',
    function () {
      return {
        restrict: 'E', // vs 'A', 'AE'
        replace: true,
        scope: {}, // vs 'true', 'null'
        template:'<span>user</span>'
      };
    }
  )
```

Note that we use "camelCase" when we define the directives, but we'll use
hyphens when inserting them into the HTML. In this case:

```html
  <ngc-user></ngc-user>
```

Angular will figure out that `ngc-user` refers to the directive that we
defined as `ngcUser`.

## Transclusion

If we set `replace: true` then the original content of the directive would be
ignored:

```html
  <ngc-user>This text will be thrown away.</ngc-user>
```

If we do want to make use of that content, we can "transclude" it into our
template:

```javascript
  .directive('ngcUser',
    function () {
      return {
        restrict: 'E', // vs 'A', 'AE'
        replace: true,
        transclude: true,
        scope: {}, // vs 'true', 'null'
        template:'<span>user <div ng-transclude/></span>'
      };
    }
  )
```

We won't be using this for the rest of this tutorial, though.

## Using An External Template

Directives usually have templates that are too complex to include as a string.
So, instead we often provide a URL to the template file:

Create a new file, `app/core/users/user-directive.js`:

```javascript
  .directive('ngcUser',
    function () {
      return {
        restrict: 'E', // vs 'A', 'AE'
        replace: true,
        scope: {}, // vs 'true', 'null'
        templateUrl: '/app/components/users/user.html'
      };
    }
  )
```
## Directives with Controllers

To make the directive do anything remotely interesting we would usually need
to implement a controller for it:

```javascript  
  .controller('NgcUserDirectiveCtrl', function () {
    var vm = this;
    vm.userDisplayName = 'Some Name';
  })

  .directive('ngcUser', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: '/app/components/users/user.html',
      controller: 'NgcUserDirectiveCtrl',
      controllerAs:'ngcUserCtrl',
      bindToController: true
    };
  })

  ...
```
A few things are going on here, `controller: 'NgcUserDirectiveCtrl'` provides a 
reference to the controller function defined on the module. 

Then `controllerAs: 'ngcUserCtrl'` gives a name to controller's scope so as to 
refer to its properties using this name within the template.

i.e.

```html
  <span>Hello, {{ ngcUserCtrl.userDisplayName }}.</span>
```

Finally, the `bindToController: true`, binds the component's properties to the 
controller rather than the scope. 


Note that in the above example the controller is provided by name, but it is also
possible to provide the controller function inline

```javascript
  ...

  .directive('ngcUser', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: '/app/components/users/user.html',
      controller: function () {
        var vm = this;
        vm.userDisplayName = 'Some Name';
      },
      controllerAs:'ngcUserCtrl',
      bindToController: true
    };
  })

  ...
```

In this case you end up hiding your controller which makes it harder to
call in unit tests.

## External Communication: Services

At the moment our directive is fully isolated. In order to be of much use,
though, it would need to connect with the rest application.

There are a few ways of doing this, but our best approach is often to rely on
services at least for a large part of that communication.

```javascript
  .controller('NgcUserDirectiveCtrl', function (users) {
    var vm = this;
    vm.userDisplayName = users.getName();
    ...
  })

  .directive('ngcUser', function () {
    return {
      ...
      controller: 'NgcUserDirectiveCtrl',
      controllerAs:'ngcUserCtrl',
      bindToController: true
    };
  })

  ...
```

We can use everything we learned so far about dependency injection to inject
services into our directive's controller.

## Using Attributes

If we want some of the data to come from the scope, we can provide it via an
argument. The most isolated way is to pass it in as a string value.

If we want to use the directive like this:

```html
  <ngc-user username="alice"></ngc-user>
```

we would need to define it this way:

```javascript
  .controller('NgcUserDirectiveCtrl', function (users) {
    var vm = this;
    vm.user = users.getUser(vm.username);
    ...
  })
  
  .directive('ngcUser', function () {
    return {
      ...
      scope: {
        username: '@username'
      },
      controller: 'NgcUserDirectiveCtrl',
      controllerAs:'ngcUserCtrl',
      bindToController: true
    };
  })

  ...
```

In this case the value of `username` argument is placed on the directive's
scope. The directive would then take it from there, using a service to get
more details.

If the name of the attribute matches the name of the scope property, we can
also just use "@" by itself:

```javascript
  scope: {
    username: '@'
  }
```

## Attribute Processing with Controllers

Alternativly, we can use $attrs provider to get access to the attribute values
specified on the directive's element.

```html
  <ngc-user username="alice"></ngc-user>
```

and

```javascript
  .controller('NgcUserDirectiveCtrl', function ($attrs, users) {
    var vm = this;
    vm.user = users.getUser($attrs.username);
    ...
  })

  .directive('ngcUser', function () {
    return {
      ...
      scope: {},
      controller: 'NgcUserDirectiveCtrl',
      controllerAs:'ngcUserCtrl',
      bindToController: true
    };
  })

  ...
```

## External 2-way Binding

Alternatively, we may want to bind a property of the directive's scope to a
specific property of the parent scope. In other words, we want to be able to
use the directive as follows:

In index.html:

```html
  <ngc-user username="user"></ngc-user>
```

where "user" is a name of a variable on the scope. This is a less isolated
approach, but the user of the directive is still in control of what parts of
the scope the directive gets to see.

We'll then need to setup the directive as follows:

```javascript
  .controller('NgcUserDirectiveCtrl', function (users) {
    var vm = this;
    vm.user = users.getUser(vm.username);
    ...
  })
  
  .directive('ngcUser', function () {
    return {
      ...
      scope: {
        username: '=username'
      },
      controller: 'NgcUserDirectiveCtrl',
      controllerAs:'ngcUserCtrl',
      bindToController: true
    };
  })

  ...
```

Again, if the name of the attribute and the scope property match, we can just
use "=".

## Binding Handlers

Finally, we may want to use attributes to allow the external scope to provide
handlers for events fired from within the directive. This is a less common
case, and the same behavior would often be better achieved using services.
However, we provide it for completeness.

For example, suppose our directive would provide us with UI elements that
would allow us to "ban" the user. Once a user is banned, we may want to notify
a controller. We can let the user attach a listener to this event by setting
"on-ban" attribute to the desired scope function:

```html
  <ngc-user username="user" on-ban="handleBan(user)"></ngc-user>
```

When the user gets banned (from inside the directive), `handleBan(user)` will
get called.

To achieve this, we would then define the directive as follows:

```javascript
  .controller('NgcUserDirectiveCtrl', function () {
    var vm = this;
    vm.fireBan();
    ...
  })
  
  .directive('ngcUser', function () {
    return {
      ...
      scope: {
        fireBan: '&onBan'
      },
      controller: 'NgcUserDirectiveCtrl',
      controllerAs:'ngcUserCtrl',
      bindToController: true
    };
  })

  ...
```

When `scope.fireBan()` gets called from within the directive, this will
trigger the external scope functions attached using "on-ban".

However, consider using a service instead. In this case, the directive could
call a method on the `users` service, such as `users.ban(user)`. The
controller on the parent scope could then get notified using a publish-
subscribe approach:

```javascript
  users.onBan(handleBan);
```

## Parsing Expressions

One neat thing we can do is use an attribute to provide an expression that
would be used by the directive:

```html
  <ngc-user username="{{user}}" cost="hours * rate"></ngc-user>
```

We set up the directive as follows:

```javascript
  .controller('NgcUserDirectiveCtrl', function ($attrs, $parse, users) {
    var vm = this;
    var userData = users.getUser(vm.username);

    var getCost = $parse($attrs.cost);
    vm.cost = getCost({
      rate: userData.rate,
      hours: userData.hours
    });
    ...
  })

  .directive('ngcUser', function () {
    return {
      ...
      scope: {
        username: '=username'
      },
      controller: 'NgcUserDirectiveCtrl',
      controllerAs:'ngcUserCtrl',
      bindToController: true
    };
  })

  ...
```

## Directives and Services

If you want to control the directive's behaviour from outside, it is usually
best to use a service. 

## Directives, Services and DOM

You should generally avoid DOM manipulation in Angular. When you need to do
it, though, the best approach is usually to capture the element in a directive
and then offload the actual manipulation to a service dedicated to this:

```javascript
.controller('NgcUserDirectiveCtrl', function ($attrs, $element) {
  var vm = this;
  vm.scroller = scroller.makeScroller($attrs.id, $element);
})

.directive('ngcUser', function () {
  return {
    ...
    scope: {},
    controller: 'NgcUserDirectiveCtrl',
    controllerAs: 'ngcUserCtrl',
    bindToController: true
  };
})

...
```

## Using Link and Compile Function

In the vast majority of the cases it is recommended to use controllers in your
directive implementation as opposed to `link()` or `compile()` functions.

Both functions and the rationale behind using them are explored in 
Section 23 - Advanced Directives