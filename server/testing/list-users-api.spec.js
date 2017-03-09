'use strict';

var supertest = require('supertest');
var assert = require('chai').assert;

var request = supertest('http://localhost:3000');

describe('Get user list tests', function() {

  it ('Should be able to get the list of tasks', function(done) {
    request.get('/tasks')
      .expect(200, done);
  });
});
