'use strict';

var supertest = require('supertest-as-promised');
var assert = require('chai').assert;

var request = supertest('http://localhost:3000');

describe('Different things you can do with HTTP', function() {
  var newTaskId;

  it ('Should be able to expect things in the response payload', function() {
    return request.get('/tasks')
      .expect(200)
      .expect(function(response) {
        var body = JSON.parse(response.text);
        assert(body.length === 2, '2 tasks returned');
      });
  });

  it ('Should be able to POST a new task', function() {
    var jsonPayload = {
      owner: 'alice',
      description: 'Write some tests!'
    };

    return request.post('/tasks')
      // Smart enough to set Content-type and JSON stringify.
      .send(jsonPayload)
      .expect(201) // 201 Created
      .expect(function(response) {
        var newTask = response.body;
        newTaskId = newTask.id;
        assert(jsonPayload.owner === newTask.owner, 'Owner is as expected');
        assert(
          jsonPayload.description === newTask.description,
          'Description is as expected');
      });
  });

  it ('Can delete a task', function() {
    // Delete a task.
    return request.delete('/tasks/' + newTaskId)
      .expect(200);
  });

  it ('Can test multi-request scenarios', function() {
    var newTaskId;
    var jsonPayload = { owner: 'alice', description: 'Write some tests!' };

    // Create a task.
    return request.post('/tasks')
      .send(jsonPayload)
      .expect(201)
      .then(function(response) {
        newTaskId = response.body.id;
        assert(!!newTaskId, 'got a new task ID');

        // Make sure we can get the newly created task.
        return request.get('/tasks/' + newTaskId).expect(200);
      })
      .then(function(response) {
        var id = response.body.id;
        assert(newTaskId === id, 'got the same task ID back again');

        // Delete the task when we're done.
        return request.delete('/tasks/' + newTaskId).expect(200);
      });
  });
});
