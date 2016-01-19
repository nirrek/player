'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SagaCancellationException = exports.CANCEL = exports.MANUAL_CANCEL = exports.RACE_AUTO_CANCEL = exports.PARALLEL_AUTO_CANCEL = exports.NOT_ITERATOR_ERROR = undefined;
exports.default = proc;

var _utils = require('./utils');

var _io = require('./io');

var _monitorActions = require('./monitorActions');

var monitorActions = _interopRequireWildcard(_monitorActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NOT_ITERATOR_ERROR = exports.NOT_ITERATOR_ERROR = 'proc first argument (Saga function result) must be an iterator';
var PARALLEL_AUTO_CANCEL = exports.PARALLEL_AUTO_CANCEL = 'PARALLEL_AUTO_CANCEL';
var RACE_AUTO_CANCEL = exports.RACE_AUTO_CANCEL = 'RACE_AUTO_CANCEL';
var MANUAL_CANCEL = exports.MANUAL_CANCEL = 'MANUAL_CANCEL';

var nextEffectId = (0, _utils.autoInc)();

var CANCEL = exports.CANCEL = Symbol('@@redux-saga/cancelPromise');

var SagaCancellationException = exports.SagaCancellationException = function SagaCancellationException(type, saga, origin) {
  _classCallCheck(this, SagaCancellationException);

  this.type = type;
  this.saga = saga;
  this.origin = origin;
};

function proc(iterator) {
  var subscribe = arguments.length <= 1 || arguments[1] === undefined ? function () {
    return _utils.noop;
  } : arguments[1];
  var dispatch = arguments.length <= 2 || arguments[2] === undefined ? _utils.noop : arguments[2];
  var monitor = arguments.length <= 3 || arguments[3] === undefined ? _utils.noop : arguments[3];
  var parentEffectId = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
  var name = arguments.length <= 5 || arguments[5] === undefined ? 'anonymous' : arguments[5];

  (0, _utils.check)(iterator, _utils.is.iterator, NOT_ITERATOR_ERROR);

  var deferredInputs = [];
  var canThrow = _utils.is.throw(iterator);
  var deferredEnd = (0, _utils.deferred)();

  var unsubscribe = subscribe(function (input) {
    deferredInputs.forEach(function (def) {
      if (def.match(input)) def.resolve(input);
    });
  });

  iterator._isRunning = true;
  next();

  return newTask(parentEffectId, name, iterator, deferredEnd.promise);

  function next(arg, isError) {
    if (!iterator._isRunning) return;
    try {
      if (isError && !canThrow) throw arg;
      var result = isError ? iterator.throw(arg) : iterator.next(arg);
      if (!result.done) {
        var currentEffect = runEffect(result.value, parentEffectId);
        deferredEnd.promise[CANCEL] = currentEffect[CANCEL];
        currentEffect.then(next, function (err) {
          return next(err, true);
        });
      } else {
        end(result.value);
      }
    } catch (error) {
      /*eslint-disable no-console*/
      console.warn(name + ': uncaught', error);
      end(error, true);
    }
  }

  function end(result, isError) {
    iterator._isRunning = false;
    if (!isError) {
      iterator._result = result;
      deferredEnd.resolve(result);
    } else {
      iterator._error = result;
      deferredEnd.reject(result);
    }
    unsubscribe();
  }

  function runEffect(effect, parentEffectId) {
    var label = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

    var effectId = nextEffectId();
    monitor(monitorActions.effectTriggered(effectId, parentEffectId, label, effect));

    var data = undefined;
    var promise = _utils.is.array(effect) ? runParallelEffect(effect, effectId) : _utils.is.iterator(effect) ? proc(effect, subscribe, dispatch, monitor, effectId).done : (data = _io.as.take(effect)) ? runTakeEffect(data) : (data = _io.as.put(effect)) ? runPutEffect(data) : (data = _io.as.race(effect)) ? runRaceEffect(data, effectId) : (data = _io.as.call(effect)) ? runCallEffect(data.context, data.fn, data.args, effectId) : (data = _io.as.cps(effect)) ? runCPSEffect(data.fn, data.args) : (data = _io.as.fork(effect)) ? runForkEffect(data.task, data.args, effectId) : (data = _io.as.join(effect)) ? runJoinEffect(data) : (data = _io.as.cancel(effect)) ? runCancelEffect(data) : /* resolve anything else  */Promise.resolve(effect);

    var def = (0, _utils.deferred)();
    var isRunning = true;
    var completeWith = function completeWith(fn) {
      return function (outcome) {
        if (isRunning) {
          isRunning = false;
          fn(outcome);
        }
      };
    };
    promise.then(completeWith(def.resolve), completeWith(def.reject));
    def.promise[CANCEL] = function (_ref) {
      var type = _ref.type;
      var origin = _ref.origin;

      if (isRunning) {
        isRunning = false;
        var error = new SagaCancellationException(type, name, origin);
        cancelPromise(promise, error);
        def.reject(error);
      }
    };

    def.promise.then(function (result) {
      return monitor(monitorActions.effectResolved(effectId, result));
    }, function (error) {
      return monitor(monitorActions.effectRejected(effectId, error));
    });
    return def.promise;
  }

  function runTakeEffect(pattern) {
    var def = (0, _utils.deferred)({ match: (0, _io.matcher)(pattern), pattern: pattern });
    deferredInputs.push(def);
    var done = function done() {
      return (0, _utils.remove)(deferredInputs, def);
    };
    def.promise.then(done, done);
    def.promise[CANCEL] = done;
    return def.promise;
  }

  function runPutEffect(action) {
    return (0, _utils.asap)(function () {
      return dispatch(action);
    });
  }

  function runCallEffect(context, fn, args, effectId) {
    var result = fn.apply(context, args);
    return !_utils.is.iterator(result) ? Promise.resolve(result) : proc(result, subscribe, dispatch, monitor, effectId, fn.name).done;
  }

  function runCPSEffect(fn, args) {
    return new Promise(function (resolve, reject) {
      fn.apply(undefined, _toConsumableArray(args.concat(function (err, res) {
        return _utils.is.undef(err) ? resolve(res) : reject(err);
      })));
    });
  }

  function runForkEffect(task, args, effectId) {
    var result = undefined,
        _iterator = undefined;
    var isFunc = _utils.is.func(task);

    // we run the function, next we'll check if this is a generator function
    // (generator is a function that returns an iterator)
    if (isFunc) result = task.apply(undefined, _toConsumableArray(args));

    // A generator function: i.e. returns an iterator
    if (_utils.is.iterator(result)) {
      _iterator = result;
    }
    // directly forking an iterator
    else if (_utils.is.iterator(task)) {
        _iterator = task;
      }
      //simple effect: wrap in a generator
      else {
          _iterator = regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return isFunc ? result : task;

                  case 2:
                    return _context.abrupt('return', _context.sent);

                  case 3:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, this);
          })();
        }

    var name = isFunc ? task.name : 'anonymous';
    return Promise.resolve(proc(_iterator, subscribe, dispatch, monitor, effectId, name, true));
  }

  function runJoinEffect(task) {
    return task.done;
  }

  function runCancelEffect(task) {
    task.done[CANCEL](new SagaCancellationException(MANUAL_CANCEL, '', name));
    return Promise.resolve();
  }

  function runParallelEffect(effects, effectId) {
    var promises = effects.map(function (eff) {
      return runEffect(eff, effectId);
    });
    var ret = Promise.all(promises);
    ret[CANCEL] = function (error) {
      promises.forEach(function (p) {
        return cancelPromise(p, error);
      });
    };

    ret.catch(function () {
      ret[CANCEL](new SagaCancellationException(PARALLEL_AUTO_CANCEL, name, name));
    });
    return ret;
  }

  function runRaceEffect(effects, effectId) {
    var promises = [];
    var retP = Promise.race(Object.keys(effects).map(function (key) {
      var promise = runEffect(effects[key], effectId, key);
      promises.push(promise);
      return promise.then(function (result) {
        return _defineProperty({}, key, result);
      }, function (error) {
        return Promise.reject(_defineProperty({}, key, error));
      });
    }));

    retP[CANCEL] = function (error) {
      promises.forEach(function (p) {
        return cancelPromise(p, error);
      });
    };

    var done = function done() {
      return retP[CANCEL](new SagaCancellationException(RACE_AUTO_CANCEL, name, name));
    };
    retP.then(done, done);
    return retP;
  }

  function newTask(id, name, iterator, done, forked) {
    var _ref3;

    return _ref3 = {}, _defineProperty(_ref3, _utils.TASK, true), _defineProperty(_ref3, 'id', id), _defineProperty(_ref3, 'name', name), _defineProperty(_ref3, 'done', done), _defineProperty(_ref3, 'forked', forked), _defineProperty(_ref3, 'isRunning', function isRunning() {
      return iterator._isRunning;
    }), _defineProperty(_ref3, 'getResult', function getResult() {
      return iterator._result;
    }), _defineProperty(_ref3, 'getError', function getError() {
      return iterator._error;
    }), _ref3;
  }

  function cancelPromise(promise, error) {
    if (promise[CANCEL]) promise[CANCEL](error);
  }
}