# Part 1: Introduction to AngularJS and ngCourse

Angular is the leading open source JavaScript application framework backed by
Google. This course ("ngCourse") provides an introduction to AngularJS based
on our experience at [Rangle.io](http://rangle.io).

## MVC and MVVM

AngularJS is often described as an MVC ("Model-View-Controller") framework.
Here is how this is often illustrated:

![Simple MVC](https://raw.githubusercontent.com/rangle/ngcourse/master/handout/images/simple-mvc.gif)

This picture, however, is far too simple.

First, only the most trivial applications can be understood as
consisting of a single model, a single view and a single controller. More
commonly, an application will include multiple views, multiple controllers,
and multiple data models. So, it might look more like this:

![Simple MVC](https://raw.githubusercontent.com/rangle/ngcourse/master/handout/images/mvvm-initial.gif)

The figure above makes another important substitution, however. "Controllers"
are replaced with "view models". Angular can be better understood as a "MVVM"
("Model-View-ViewModel") framework. In this approach, we have "view models"
mediating between views and (data) models. While this may seem like just a
minor change of terminology, the idea of "view model" helps clarify the path
towards better AngularJS architecture. A view model is a mediating object that
takes data from a data model and presents it to a view in a "digested" form.
Because of that, the view model superficially looks like a model. It should
not be confused with the application's real data models. Misusing the view
model as the model is one of the most common sources of problems in AngularJS.

Now let's see how MVVM model is realized in AngularJS.

## View Synchronization

Most introductions to Angular start with a look at the "front-end" of the
framework. Let's do the same here, even though most of your AngularJS code
should be in the model layer.

![Simple MVC](https://raw.githubusercontent.com/rangle/ngcourse/master/handout/images/mvvm-front-end.gif)

AngularJS views are HTML templates that are extended with custom elements and
attributes called "directives". AngularJS provides you with a lot of
directives and you will also be developing some yourself.

Views are linked with view models that take the form of "controllers" and
custom "directives". In either case we are looking at some code that controls
JavaScript objects (the actual "view model") that are referenced in the
templates. Angular refers to those as "scopes." AngularJS automatically
synchronizes DOM with view models through what it calls "two way data
binding": when an property of a view model is changed, the DOM is updated to
reflect it and when an input field is changed in the DOM, the view model is
updated.

This makes AngularJS very "designer-friendly": designers can modify HTML
templates without worrying too much about the code. The reverse is also true:
as long as there is a designer on the team, developers are largely freed from
worrying about HTML and CSS.

Angular "scopes" (view models) can be organized into a hierarchy that partly
mirrors DOM structure. We strongly recommend avoiding this, however, because
such a design introduces complex dependencies and make testing difficult.
Instead, we recommend keeping view models isolated and doing as little work as
possible. Instead, most of the work (in particular, all of the business logic)
should be moved to the lower "model" level.

More generally, it is important to understand that view models are a temporary
staging area for your data on the way to the view. They should not be abused
by being forced to act as your primary model.

## Models in Services

AngularJS does provide us with a great way to implement our data models at
arms length from the views using a mechanism called "services".

![Simple MVC](https://raw.githubusercontent.com/rangle/ngcourse/master/handout/images/mvvm-final.gif)

Services are singleton objects that normally do not concern themselves with
the DOM but instead take care of your data. The bulk of your application's
business logic should belong in services. We'll spend a lot of time talking
about this.

Services get linked together through an approach that AngularJS calls
"dependency injection". This is also how they are exposed to view models
(controllers and custom directives).

In the case of Angular, what "dependency injection" practically means is that
view models do not get to create and define their dependencies. Instead,
services are created _first_, before any part of the view-model layer is
instantiated. Each component's definition specifies what dependencies should
be provided to the component.

Angular's dependency injection is one of the best things about the framework.
This approach makes your code more modular, reusable, and easier to test.
Those features are essential when building larger applications.
