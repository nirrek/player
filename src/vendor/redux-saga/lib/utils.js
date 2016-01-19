'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.check = check;
exports.remove = remove;
exports.deferred = deferred;
exports.arrayOfDeffered = arrayOfDeffered;
exports.autoInc = autoInc;
exports.asap = asap;

var _marked = [sampleGen].map(regeneratorRuntime.mark);

var TASK = exports.TASK = Symbol('TASK');
var kTrue = exports.kTrue = function kTrue() {
  return true;
};
var noop = exports.noop = function noop() {};

function check(value, predicate, error) {
  if (!predicate(value)) throw new Error(error);
}

function sampleGen() {
  return regeneratorRuntime.wrap(function sampleGen$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
      case 'end':
        return _context.stop();
    }
  }, _marked[0], this);
}
var genConstructor = sampleGen.constructor;

var is = exports.is = {
  undef: function undef(v) {
    return v === null || v === undefined;
  },
  func: function func(f) {
    return typeof f === 'function';
  },
  array: Array.isArray,
  promise: function promise(p) {
    return p && typeof p.then === 'function';
  },
  generator: function generator(g) {
    return is.func(g) && g.constructor === genConstructor;
  },
  iterator: function iterator(it) {
    return it && typeof it.next === 'function';
  },
  throw: function _throw(it) {
    return it && typeof it.throw === 'function';
  },
  task: function task(it) {
    return it && it[TASK];
  }
};

function remove(array, item) {
  var index = array.indexOf(item);
  if (index >= 0) array.splice(index, 1);
}

function deferred() {
  var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var def = _extends({}, props);
  var promise = new Promise(function (resolve, reject) {
    def.resolve = resolve;
    def.reject = reject;
  });
  def.promise = promise;
  return def;
}

function arrayOfDeffered(length) {
  var arr = [];
  for (var i = 0; i < length; i++) {
    arr.push(deferred());
  }
  return arr;
}

function autoInc() {
  var seed = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

  return function () {
    return ++seed;
  };
}

function asap(action) {
  return Promise.resolve(1).then(function () {
    return action();
  });
}