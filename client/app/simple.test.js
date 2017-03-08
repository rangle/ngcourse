// Define a test suite.
describe('tasks', function () {
  // Define a test.
  it('should have 2*2 be equal to 4', function () {
    var x;
    // Do something.
    x = 2 * 2;
    // Check that the results are what we expect and throw an error if something is off.
    if (x !== 4) {
      throw new Error('Failure of basic arithmetics.');
    }
  });
});