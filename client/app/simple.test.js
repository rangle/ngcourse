var expect = chai.expect;

// Define a test suite.
describe('tasks', function () {
  // Define a test.
  it('should have 2*2 be equal to 4', function () {
    var x = 2 * 2;
    var y = 4;
    // Assert that x is defined.
    expect(x).to.not.be.undefined;
    // Assert that x equals to specific value.
    expect(x).to.equal(4);
    // Assert that x equals to y.
    expect(x).to.equal(y);
    // See http://chaijs.com/api/bdd/ for more assertion options.
  });
});