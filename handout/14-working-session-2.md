# Part 14: Working Session 2

In this working session we'll use what we've learned in the recent modules to
enhance our application.

## Routing

Let's add a more sophisticated routing setup.

We already have a state "tasks" where the user gets to see a list of tasks and
a "tasks.details" state where the user gets to see the details of a specific
tasks.

Now, let's make the following enhancements:

1. Expand "tasks.details" state to support _editing_ the task.

2. Add a new "tasks.add" state for _adding_ a task.

3. Make "tasks.details" and "tasks.add" states override a sub-view
  ("actionArea@tasks") in the task list view. This way, the user won't be
  taken to a different view, but rather would see a task editor / adder appear
  on the same page, even as we make a transition to new state.

## Form Validation

Let's use what we've learned about form validation to enhance the task addition and editing forms.

1. Add inline validation for the length of the task.

2. The form should highlight the fields that are set correctly.

3. The submit button should be disabled if the data is invalid.

