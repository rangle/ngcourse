# Part 16: Custom Providers

In part 11 we used `.config()` methods to configure ui-router. We then defined
our own `router` service to provide the rest of our application with a more
convenient access to routing information.

For dealing with more complex routing setups, however, we might find ourselves
running into an important limitation of our `router` service. Suppose we want
to expand this service to actually create new states for us. It turns out that
this cannot be done with a service defined with `.factory()` or `.service()`.

Here is the reason: `ui-router` states are defined in the configuration stage,
and our `router` service is not available at this point. It is only
instantiated later, in the service instantiation stage of the app's
initialization. (See the list in part 11.) This means that the methods
provided by this service cannot be used to help us define `ui-router` states.

If we want to define methods for creating new states, those methods will need
to be defined in a _provider_. Note that this is essentially what we've done
so far: we have created states in a `.config()` block by calling methods on
`$stateProvider`, which is a _provider_, that is a "factory factory".

If we want to offer a higher level interface to act as an alternative to using
`$stateProvider` directly, we will need to create our own provider, which
we'll be able to use in a `.config()` block.

## Defining a Service via a Custom Provider

A basic provider is just a function that returns an object with a `$get()`
method. This method is later used to create a service. The provider is defined
with the same name as the service that it will be creating:

```javascript
.provider('router', function() {
  // Creates the service.
  this.$get = function () {
    var service = {};
    // Implement the service.
    return service;
  };
});
```

The `$get()` method of this provider will be called in the service
instantiation phase. The object returned by this method will become the
`router` service.

Note that we make use of `this` when defining a provider, in a similar way as
we would be doing if we were defining a service with `.service`. Angular will
be calling our provider function with `new` to make sure that `this` refers to
the newly created instance.

## Dependency Injection with Providers

Services defined by providers can participate in dependency injection.
Services used by our `router` service would be specified as arguments to the
`$get()` method, like so:

```javascript
  this.$get = function ($state, $stateParams, $window, $location) {
    var service = {};

    // Implement the router service as before.

    return service;
  };
```

Or, if we prefer, we can use annotations:

```javascript
  this.$get = ['$state', '$stateParams', '$window', '$location',
    function ($state, $stateParams, $window, $location) {
      var service = {};

      // Implement the router service as before.

      return service;
    }
  ];
```

Additionally, however, we can inject other providers into our custom provider:

```javascript
.provider('router', function($stateProvider, $locationProvider, $urlRouterProvider) {

  // Make use of $stateProvider, $locationProvider, etc.

});
```

Note that `.provider()` can only inject other providers and constants. It
cannot inject services, since those are not yet available when the provider is
instantiated. However, when we define our service creation function using
`$get()` we can inject services.

Note that provider names get suffixed with `Provider` when they are dependency
injected. Our own provider `router` will be known as `routerProvider`.

## Adding Configuration Methods

A provider that just defines `$get()` is not going to be very useful - we
might as well just use `.factory` in this case. However, use of `.provider`
allows us to add configuration methods. In this case, let's add a method
`.addSection`, which will add a set of states that would all be appended to
the same parent, defining a section of the application. With this approach,
different section of our application can define their substates without
stomping on each other's states.

```javascript
.provider('router', function($stateProvider, $locationProvider, $urlRouterProvider) {

  // Set defaults and create the main state.

  this.addSection = function (section) {
    ...
    section.substates.forEach(function(substate) {
      $stateProvider.state('main.' + section.name, substate);
      });
    };
```

This allows us to define states for each section of our sites in the `.config()` block of that
section's module:

```javascript
.config(function('routerProvider') {
  routerProvider.addSection({
    name: 'tasks',
    substates: [...]
  });
});
```

Our `router` service does not yet exist at this point, but its provider
(`routerProvider`) is already available. We can use
`routerProvider.addSection` to create section states instead of using
`$stateProvider` directly. The advantage that this offers us is that we can
then make sure that section states are created in a uniform and DRY way.

## Using `.provider` to add Custom Service Methods

We can further use `.provider` to customize the service that will be created
eventually.

In Part 11, we gave our `router` service a method `getTaskId` that would
retrieve the ID of the task from the route:

```js
  service.getTaskId = function() {
    return $stateParams.id;
  };
```

As our application gets more complex, though, we might find this method hard
to scale. Each section of the site might need its own custom methods for
accessing route parameters. Defining all of them in one place will get
unwieldy.

Instead, we may want to be able to define such methods separately for each
section, as we define the states:

```javascript
  .config(function('routerProvider') {
    routerProvider.addSectionMethod('tasks', 'getTaskId', function (router) {
      return router.getParam('taskId');
    });
    ...
  });
```

This would add method `getTaskId()` to `router` service, putting it into
`tasks` property of the service. In other words, when we want to get task id,
we'll be calling `router.tasks.getTaskId()`.

How would we implement this? We will do this by adding `addSectionMethod()` as
another method of the provider. This method will take the provided
implementation function and save it in a variable defined in the scope of the
provider function.

```javascript
  .provider('router', function($stateProvider, $locationProvider, $urlRouterProvider) {
    var sectionMethods = [];

    this.addSectionMethod = function (sectionName, methodName, handler) {
      sectionMethods[sectionName] = sectionMethods[sectionName] || {};
      sectionMethods[sectionName][methodName] = handler;
    };

    // Creates the service.
    this.$get = function ($state, $stateParams, $window, $location) {
      ...
    };
  });
```

Note that our `addSectionMethod()` doesn't actually do much. It just adds the
provided to an object storing this section's methods.

To make those methods available as a part of the service, we'll have to attach
them to the service in our `$get()` method:

```javascript
    this.$get = function ($state, $stateParams, $window, $location) {
      var service = {};

      // Add configured section methods to the service
      Object.keys(sectionMethods).forEach(function(section) {
        service[section] = sectionMethods[section];
      });

      // Implement the rest of the service.

      return service;
    }
```

What this code does is take methods saved in `sectionMethods` (where they were
put by all the calls to `addSectionMethod()` and add them to the service
instance.

This implementation, however, has an unpleasant flaw, however.

## Using Services in Config Blocks

Let's first go back to the definition of each section method:

```javascript
  .config(function('routerProvider') {
    routerProvider.addSectionMethod('tasks', 'getTaskId', function (router) {
      return router.getParam('taskId');
    });
    ...
  });
```

Note that our implementation relies on a method provided by our service:
`router.getParam()`. However, we are defining this method inside a `.config()`
block, which means that service `router` is not yet available at this point.
This is not a big problem, the function we are providing won't be called at
this point either. Rather, it will only be called much later, when service
router has already been created. This does mean, however, that we'll have to
provide a reference to the service as an argument to our method.

In other words, when we call `router.tasks.getTaskId()`, we would actually
have to do this: `router.tasks.getTaskId(router)`. This way, our
implementation of this method, which we provided in the config block will have
access to the instance of `router` that we didn't have when we defined (but
which we do have now). This is ugly, though.

We can fix this by making our implementation of the `$get()` method a bit
smarter. Let's take advantage of the fact that while router service is not
available in the scope of the config block, it _is_ available inside `$get()`.
So, instead of simply copying all methods from `sectionMethods`, let's tweak
each one of them, passing the service as the first argument. We can
do this by wrapping each of the provided methods in a new function, taking the
list of arguments with which this function was called (available to us as
`arguments`), converting it into an array using `slice()` and inserting the
service into the beginning of that list (using `unshift`):

```javascript
    this.$get = function ($state, $stateParams, $window, $location) {
      var service = {};

      // Add configured section methods to the service
      Object.keys(sectionMethods).forEach(function(section) {
        service[section] = {};
        Object.keys(sectionMethods[section]).forEach(function(method) {
          service[section][method] = function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(service); // Add service as the first argument.
            return sectionMethods[section][method].apply({}, args);
          };
        });
      });

      // Implement the rest of the service.

      return service;
    }
```


This makes it possible for us to later not worry about providing `router`
service to our section methods. Instead, we can now use our custom method in a
controller as follows:

```javascript
var taskId = router.tasks.getTaskId();
```
