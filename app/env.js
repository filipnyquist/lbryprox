'use strict';

const prettyError = require('pretty-error');

var EnvManager = (function () {
  // check if we have an invalid node_env set.
  if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') process.env.NODE_ENV = 'development'; // set to development by default.
  var env = global.env = process.env.NODE_ENV;
  if (env === 'development') prettyError.start(); // on development mode start the pretty errors.
})();

module.exports = exports = EnvManager;