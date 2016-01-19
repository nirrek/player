'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = emitter;

var _utils = require('./utils');

function emitter() {

  var cbs = [];

  function subscribe(cb) {
    cbs.push(cb);
    return function () {
      return (0, _utils.remove)(cbs, cb);
    };
  }

  function emit(item) {
    cbs.slice().forEach(function (cb) {
      return cb(item);
    });
  }

  return {
    subscribe: subscribe,
    emit: emit
  };
}