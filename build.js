console.log('Don\'t use this.');
// var path = require('path');
// var Builder = require('systemjs-builder');

// var builder = new Builder({
//   baseURL: 'file:' + path.resolve('client/app'),

//   // any map config
//   map: {
//     'task-list-controller': 'sections/task-list/task-list-controller.js'
//   },

//   // opt in to Babel for transpiling over Traceur
//   transpiler: 'typescript'

//   // etc. any SystemJS config
// })
// .buildSFX('app', 'client/dist/bundle.js',
//   {sourceMaps: true})
// .then(function() {
//   console.log('Build complete');
// })
// .catch(function(err) {
//   console.log('Build error');
//   console.log(err);
// });