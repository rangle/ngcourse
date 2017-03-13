# Part 16. Final Working Session.

For the last working session let's branch off `cbc-training` and extend the
application with additional features. To do this, do the following:

```bash
  # store your current work locally
  git add .
  git commit -am "my current work"

  # get the updated master
  git checkout cbc-training
  git pull

  # create your own working branch
  git checkout -b my-branch
```

Take a moment to familiarize yourself with the app. Now we can make some
further improvements.

## Mark Tasks as Done

Tasks have a "done" field, which can be used to mark a task as "done". (We'll
be using "tasks.updateTask" to update a task.)

1. Change the table to display a checkbox for each task that is done.
2. Add a button saying "Done" to all tasks that are not yet done.
3. Wire the button to update the tasks as done.
4. Ensure that the user can only mark as done tasks that they are allowed to edit.

## Make It Easier to See Incomplete Tasks

Let's make some changes to help the user see their incomplete tasks.

1. Use ng-repeat's "orderBy" filter to show incomplete tasks first.
2. Add a button that hides done tasks altogether.
3. Create two separate tables for the user's own tasks and other people's tasks.

Those tasks will require using "orderBy", which looks like this:

```html
  {{ task in tasks | orderBy: expression}}
```

You will also need to use a filter:

```html
  {{ task in tasks | filter: expression}}
```

Hint: if your expression ends up being complex, put it in a function.
