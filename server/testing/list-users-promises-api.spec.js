'use strict';

var supertest = require('supertest-as-promised');
var assert = require('chai').assert;

var request = supertest('http://localhost:3000');

describe('Get user list tests (promises)', function() {

  it ('Should be able to get the list of tasks', function() {
    return request.get('/tasks')
      .expect(200);
  });
});
