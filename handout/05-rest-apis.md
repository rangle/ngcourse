# Part 5. Making HTTP Requests.

Most AngularJS apps will need to interact with a backend system to achieve
their objectives. By far the most common protocol for this is HTTP (or,
preferably, it's secure version, HTTPS). While this is the same protocol that
was employed by the previous generation of web applications, it tends to be
used rather differently in a context of a modern single-page application
framework such as AngularJS.

## Talking to a RESTful Server via Postman

In most cases, the Angular application and the server will not be exchanging
HTML. Instead, they will be exchanging data using an approach that is usually
referred to as "RESTful". The key idea is that each URL is normally understood
to represent a data "resource" in some collection of resources. The
application can use HTTP to create a resource, retrieve an existing one,
update it, or delete it.

Before we begin talking to the server from our web application, let's get
comfortable interacting with the REST API using Postman.

If you do not have Postman installed, get it here: <http://www.getpostman.com/>

Our server is setup at http://localhost:3000. Here is our `tasks` endpoint:

    http://localhost:3000/tasks

  Make sure that the `json-server` is started:

```sh
  json-server --watch db.json
```

## HTTP Methods

An HTTP client interacts with server resources using HTTP methods:

__GET__ to retrieve some resource (or resources). E.g.:

```
  GET http://localhost:3000/tasks/1
```

The server will respond with the a set of objects representing matching resources:

```js
[{
  "id":"1",
  "owner":"bob",
  "description":"Get the Milk."
}]
```

GET requests often also include a query, encoded as a query string.

__POST__ to create a new resource.

```
  POST http://localhost:3000/tasks/ + data
```

__PUT__ to update an existing resources.

```
  PUT http://localhost:3000/tasks/1 + data
```

__DELETE__ to delete an existing resource.

```
  DELETE http://localhost:3000/tasks/1
```

## Content Type

RESTful APIs can exchange data using a variety of encoding formats. By far the
most common format today is JSON. In a typical Angular application, this is
the format used by the server for sending data in response to a GET request
and by the client when sending data with a POST or PUT request. Even though
JSON is quite common, the client and the server are supposed to notify each
other that this is the format being used by using header. For JSON, the proper
content-type is:

```
  Content-Type: application/json
```

for compatibility reasons, however, many servers will specify the type as:

```
  Content-Type: text/plain
```

The good news, however, is that Angular will assume that you are using JSON
and will handle the details for you.

## Status Codes

An HTTP response must contain a numeric status code that indicates whether the
request was handled successfully. Legacy web applications often use such
codes in a sloppy way, responding to all requests with the same code "200
Success." REST APIs usually approach status codes more seriously. This allows
your application to rely on them to determine what happened and how to
proceed.

There are many status codes in use and not all servers use them in the same
way. The most important thing is to properly handle codes in each of the
distinct _ranges_ show below:

__200-299__: All codes in this range signify that the server did what it
thought you asked it to do. The most common success codes are "200 Success"
and "201 Created" (usually sent in response to a successful POST request).
Some servers will just use "200" for all success responses.

__400-499__: All codes in this range mean that the server didn't do what you
asked because it found some flaw with your request. This normally indicates
that _you_ (or the user of the application) are doing something wrong. The
most common 400-level codes are "400 Bad Request" (generic), "401
Unauthorized" (the client needs to be authenticated), "403 Forbidden" (you are
not authorized to do what you are asking to do), and "404 Not Found" (the
resource you are asking for does not exist, or you are not allowed to know
whether it exists). Some servers will send additional 400-level status code
for certain specific problems, while others will fall back on "400" if none of
the options above apply. It is important for your application to identify the
different 400-level codes used by your server, since they may help you
determine what to do next. For example, a 401 response would normally require
that you ask the user to re-login, while a 403 response would usually mean
telling the user that they aren't allowed to do whatever they were trying to
do.

__500-599__: These codes indicate _server_ errors. The server cannot do what
you asked because something is wrong on the server. Normally, this means that
it's _not_ your application's fault and there is little you can do other than
try again later (or get in touch with the administrators for the server).
There are many specific 500-level status codes, but from your application's
perspective it usually doesn't matter what exactly happened. You do, however,
want to handle such errors somehow, perhaps by showing an error message saying
"Sorry, we are having trouble talking to the server. Let's try again in a
little bit."

## CORS

Most browsers today follow a "same-origin policy", which stops your web
application from making HTTP requests to servers other than the one from which
the application itself was loaded. In our case right now, the web app is being
loaded from localhost, so under this policy it would only be allowed to send
HTTP requests to localhost. While this made sense in the past, in most modern
single-page applications this is impractical. Usually, your app will need to
talk to a server on some other host. (In our case, it's
"localhost:3000.") When you try to do this, however, you may get an
error that would look roughly like this:

> XMLHttpRequest cannot load [some URL]. Origin [some domain] is not allowed
> by Access-Control-Allow-Origin.

There are two solutions to this problem.

__CORS__. The correct solution is for your server to implement "CORS", which
is a mechanism for telling your web browser that it's ok for your application
to talk to this server. It's a fairly simple thing to enable with most modern
server technologies, and once it's done on the server, there is nothing more
for you to do on the client if you are using AngularJS and a modern web
browser.

__Disable web security.__ The second option is to disable cross-origin
security policy (among other things) in the browser. This makes sense if
same-origin policy is not going to be a problem in deployment and the server is not
going to support CORS. If using Google Chrome, you can achieve this by running
it with `--disable-web-security` flag. For example, on OSX:

```bash
  open -a /Applications/Google\ Chrome.app --args --disable-web-security
```

Or on Windows:

```
  chrome.exe --disable-web-security
```

Same-origin policy does _not_ apply to apps built with Cordova. However, you
will run into this option when testing those apps in a web browser.

## $http

Now we are ready to start making HTTP calls from our Angular app.

While AngularJS provides a service called `$resource` to interacting with
RESTful APIs, we won't be using it, because use of `$resource` often leads to
an "optimistic" approach to asynchronous code, which results in bugs that are
hard to track. Instead, we will be using a more basic Angular server, `$http`.

Let's start by just getting a list of tasks:

```javascript
  .controller('TaskListCtrl', function($http, $log) {
    var vm = this;
    vm.tasks = [];

    $http.get('http://localhost:3000/tasks')
      .success(function(data, status) {
        $log.info(data);
        vm.tasks = data;
      })
      .error(function(data, status) {
        $log.error(status, data);
      });
  });
```

Here we are making an HTTP GET request and providing two callbacks: one to
handle successful responses (200-level status codes or redirects that
eventually lead to a 200-level status code) and another to handle errors (400-
and 500-level status codes).

When the callbacks are called, they will be passed the data, expanded into a
full JavaScript object or array and the specific status code.

We'll focus on a somewhat different different approach, though:

```javascript
  .controller('TaskListCtrl', function($http, $log) {
    var vm = this;
    vm.tasks = [];

    $http.get('http://localhost:3000/tasks')
      .then(function(response) {
        $log.info(response);
        vm.tasks = response.data;
      })
      .then(null, function(error) {
        $log.error(error);
      });
  });
```

This takes advantage of the fact that `$http.get()` returns an object that can
act as a standard "promise".

In addition to `$http.get()`, there is also `$http.post()`, `$http.put()`,
`$http.delete()`, etc. They all return promises. To get more mileage out of
those methods, we'll have to spend some time looking closely at promises.
