# Part 15: Authentication and Authorization

Our app has a login form, but up until now we've glossed over the details of
what that means in the context of an AngularJS application.  Let's talk more
about that now.

## Authentication vs. Authorization

First let's recap what the two words mean.

### Authentication

Authentication is the act of confirming a user's identity.  We just want to know
who we're talking to.

This is where login comes into play - by logging in, a user confirms his or her
identity with the application.

There are a number of was to perform authentication over HTTP:

#### Consider "social" authentication.

Authentication using Google, Facebook, etc., allows you to push some of the
work onto those applications and the user has one less password to remember.

#### Use token-based authentication.

Once the user is authenticated, you will need to either issue them an
authentication token or a cookie. Tokens are vastly preferred.

Cookies are easier to steal and are hard to use in a multi-server setup.
Tokens solve both of those problems. They can also be used with a completely
stateless server architecture.

Our standard solution is JWT-style bearer tokens.

#### When using cookies, protect against CSRF.

If you _must_ use cookies, make sure your app is safe against
[cross-site request forgery (CSRF)](http://en.wikipedia.org/wiki/Cross-site_request_forgery).

Angular provides a solution for this via the user of `X-XSRF-TOKEN` header.
However, in order for this to work this needs to be supported on the server.
You would also need to verify that this is actually working in your case.

### Authorization

Authorization is about determining whether a given user has the right to perform
an action with the application.  For example, should a user be allowed to view
his own tasks?  How about someone else's tasks?

Should a user be allowed to update a given task?

These are the questions that authorization is designed to answer.  Note that
authentication is in most systems a pre-requisite to authorization: we can't
know what rights a user has until we know who that user is.

## Client-Side vs. Server-Side

In an AngularJS application, authentication and authorization are typically
performed both on the client and the server.  However, the intent is different.

### Client-Side: the 'Good Cop'

A well-written client will have enough context to prevent a _well-intentioned_
user from accidentally trying to do something he or she is unauthorized to do.

This is to provide a good user experience; guiding the user into the correct
way of using our application is better than confusing him or her with irrelevant
controls and scary-looking error messages.

Such a client will be able to perform basic authorization in order to

* Hide or disable controls for actions the current user is unable to perform.
* Provide error-handling UI flows that make sense within the context of what the
  user is trying to do.

But...

> "locks are for honest people"

The user's browser or mobile device is an inherently untrusted environment: we
can't control what a _malicious user_ or _compromised client_ will do.

__Example:__

The app we've been building currently only does 'good cop' authentication.  We
hide and show various page elements based on `MainController.isAuthenticated`,
which is set on a successful submission of the login form.

A malicious user would be able to override that very easily.

Here's an example:

* Right click the login form and choose "inspect element".
* In the dev tools window, select the "Console" tab and type:
  `$scope.main`

You'll be able to see and manipulate all the variables in your main controller!

* Expand $scope.main.user and change the `isAuthenticated` field.

...oops.

Imagine if there were no server-side authorization: how much damage could a
malicious user or script do?

### Server-Side: the 'Bad Cop'

It is always necessary to enforce authentication and authorization rules on the
server side.

Therefore it falls to the server to be the enforcer.  If a client makes an
unauthorized request, the server must return an error instead of processing it.

## An Example Server: Koast

At [Rangle.io](http://www.rangle.io), we have a seed project for a basic
server, called [koast](https://www.npmjs.com/package/koast). We also publish
a client-side helper module called
[koast-angular](https://github.com/rangle/koast-angular) which is available
as a bower package.

This course's example server was built with 'koast', and exposes a `/v2` API
designed to demonstrate some more realistic authentication and authorization
scenarios.

## Some Practical Examples

### Initializing Koast

The `koast` server module uses REST conventions to organize its HTTP APIs.
In a nutshell, this means that they are grouped into 'resources' that have a predicable structure.

This also means that on the client side, `koast-angular` is able to infer a
lot about the server's features with a very small amount of configuration.

Take a look at the final version of client/app/app.js:

```javascript
'use strict';

angular.module('ngcourse', [
  'ngcourse.main-ctrl',
  'ngcourse.tasks',
  'ngcourse.users',
  'ngcourse.router',
  'koast'
])

.constant('API_BASE_URL', 'http://ngcourse.herokuapp.com')

.run(function ($log, koast, API_BASE_URL) {
  $log.info('All ready!');

  koast.init({
    baseUrl: API_BASE_URL
  });
  koast.setApiUriPrefix('/api/v2/');
  koast.addEndpoint('tasks', ':_id', {
    useEnvelope: true
  });
  koast.addEndpoint('users', ':_id', {
    useEnvelope: true
  });
});
```

In addition to declaring `koast-angular` as a dependency, there's a `.run()`
block that tells it what HTTP resources it can use.  We declare `tasks`
and `users` resources, and with the usual GET, POST, PUT, DELETE conventions
from REST the client knows how to manipulate both types of data.

This is much simpler than writing code to call all eight routes directly using
`$http` like we've done previously in `server-service.js`.

### Login

The ngcourse server provides us with URLs for login and logout.  This gives
the server to enforce authentication for real.  One immediate impact of this is
that our login code now involves a server call, and therefore an extra level
of asynchronicity.

You can see the app use this in the final version of `main-controller.js`:

```javascript
'use strict';

angular.module('ngcourse.main-ctrl', [
  'ngcourse.users',
  'koast'
])

.controller('MainCtrl', function ($log, $state, koast, users) {
  var vm = this;
  vm.user = koast.user;

  koast.user.whenAuthenticated()
    .then(function() {
      return users.whenReady()
    })
    .then(function() {
      vm.userDisplayName = users.getUserDisplayName(koast.user.data.username);
    })
    .then(null, $log.error);

  vm.login = function (form) {
    koast.user.loginLocal(form)
      .then(function(){
        $state.go('tasks');
      })
      .then(null, showLoginError);
  };
  vm.logout = function () {
    koast.user.logout()
      .then(null, $log.error);
  };

  function showLoginError(errorMessage) {
    vm.errorMessage = 'Login failed.';
    $log.error(errorMessage);
  }
});
```

Here, we're depending on `koast`, which refers to the 'koast-angular' client-side
helper module.

`vm.login` tells 'koast-angular' to initiate a login.  It also registers a promise
rejection handler for any errors.  However, note that this function is
asynchronous.  The `koast.user` module holds on to a promise internally which we
can access calling `koast.user.whenAuthenticated()` and attaching our own
success handler.

The advantage of this method is that we only need to log in once.  The result
of that login is effectively cached simply by holding onto the promise.  The
code to update the view model can be completely decoupled from the login
invocation itself.

### Main Form
Change login call to pass a single form argument:
```html
    <button
      ng-click="main.login(loginForm)"
      ng-disabled="loginForm.form.$invalid">Login
    </button>
```

### Index.html
We can add header type information to index.html to have it show on all pages.
```html
  ...
  <body ng-app="ngcourse">

    <div ng-controller="MainCtrl as main">
        <div ng-show="main.user.isAuthenticated">
          Hello, <span>{{main.userDisplayName}}</span>!
          <button ng-click="main.logout()">Logout</button>
        </div>

      <div ui-view></div>
    </div>
```

### Users Service
We've also created a users service in `app/core/users/users-service.js` for managing some of the user logic.

```javascript
'use strict';

angular.module('ngcourse.users', [
  'koast'
])

.factory('users', function (koast) {
  var service = {};
  var byUserName = {};
  var usersPromise = koast.user.whenAuthenticated()
    .then(function () {
      return koast.queryForResources('users')
        .then(function (userArray) {
          service.all = userArray;
          userArray.forEach(function(user) {
            if (user.username) {
              byUserName[user.username] = user;
            }
          });
        });
    });

  service.whenReady = function () {
    return usersPromise;
  };

  service.getUserByUsername = function(username) {
    return byUserName[username];
  };

  service.getUserDisplayName = function(username) {
    var user = service.getUserByUsername(username);
    return user.displayName;
  };

  return service;
});
```

### Logout

Logout is implemented in a similar way, but with a couple of additional details:
when you click the logout button in the UI, you'll notice that the application re-loads
itself.

During the course of the user's session with the application, he or she will
have accumulated a decent amount of state in the JavaScript application and in
the DOM.  This state needs to be cleared when we logout.  It turns out that a
simple way to do this is to simply reload the page, resetting the application
to its initial state.

If you were storing anything in local storage, you should also be sure to delete
it at this time.  These two steps are an easy way to reset the application to
its initial state so that we don't get user data leaking out if another user
signs in subsequently using the same machine.

`koast.user.logout()` uses `$window.location.replace('/')` internally for this
purpose.

### Authorization

The v2 API provides some extra data that can help us do 'good-cop' authorization
in the application.

To recap: we want to be able to hide controls for operations the current user
isn't authorized to perform.

An example of this is the task list: when Alice logs in, she should only be
allowed to edit tasks that belong to her.  The final version of the app lets
the server tell us what she can edit.

First let's look at getting the tasks from the authenticated v2 endpoint:

```javascript
'use strict';

angular.module('ngcourse.tasks', [ 'koast' ])
.factory('tasks', function (koast) {
  var service = {};

  function makeAuthenticatedMethod(functionToDelay) {
    return function () {
      var myArgs = arguments;
      return koast.user.whenAuthenticated()
        .then(function () {
          return functionToDelay.apply(service, myArgs);
        });
    };
  }

  service.getTasks = makeAuthenticatedMethod(function () {
    return koast.queryForResources('tasks');
  });

  service.addTask = makeAuthenticatedMethod(function (task) {
    return koast.createResource('tasks', task)
  });

  service.updateTask = makeAuthenticatedMethod(function (task) {
    return task.save();
  });

  service.getTask = makeAuthenticatedMethod(function (id) {
    return koast.getResource('tasks', {
      _id: id
    });
  });

  return service;
});
```

Make these changes to your `app/core/tasks/tasks-service.js`.

Also, update your `app/sections/task-add/task-add-controller.js` and `app/sections/task-edit/task-edit-controller.js` to use 'addTask' and updateTask' in case your prior service signatures were different.

This is also an example of 'good-cop' _authentication_ on the client-side:

`makeAuthenticatedMethod(fn)` wraps a server call in a check to make sure
the user is authenticated before actually making a secure server call.
We use our old friend `koast.user.whenAuthenticated()` to do this
asynchronously, but with a cached promise so that we only need to
authenticate the first time.

Now let's look at the 'good-cop' _authorization_ logic:

Recall that the response for `/api/v1/tasks` looks something like this:

```json
[
  {
    "_id": "54c5bf6a336fdb2f3cde5534",
    "owner": "bob",
    "description": "Get the Milk",
    "__v": 0
  },

  ...
]
```

`/api/v2/tasks`, on the other hand, gives us some rights information for each
task:

```json
[
  {
    "meta": {
      "can": {
        "edit": false
      }
    },
    "data": {
      "_id": "54c5bf6a336fdb2f3cde5534",
      "owner": "bob",
      "description": "Get the Milk",
      "__v": 0
    }
  },
  ...
]
```

This is how the UI decides whether to show the 'edit' link for each task:

```html
<tr ng-repeat="task in taskList.tasks">
    <td>{{taskList.getUserDisplayName(task.owner)}}</td>
    <td>{{task.description}}</td>
    <td ng-show="task.can.edit"><a ui-sref="tasks.details({id: task.id})">edit</a>
    </td>
</tr>
```
