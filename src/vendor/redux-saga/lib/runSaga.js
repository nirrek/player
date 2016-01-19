'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NOT_ITERATOR_ERROR = undefined;
exports.storeIO = storeIO;
exports.runSaga = runSaga;

var _utils = require('./utils');

var _proc = require('./proc');

var _proc2 = _interopRequireDefault(_proc);

var _emitter = require('./emitter');

var _emitter2 = _interopRequireDefault(_emitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NOT_ITERATOR_ERROR = exports.NOT_ITERATOR_ERROR = "runSaga must be called on an iterator";

/**
  memoize the result of storeChannel. It avoids monkey patching the same store
  multiple times unnecessarly. We need only one channel per store
**/
var IO = Symbol('IO');
function storeIO(store) {

  if (store[IO]) return store[IO];

  var storeEmitter = (0, _emitter2.default)();
  var _dispatch = store.dispatch;
  store.dispatch = function (action) {
    var result = _dispatch(action);
    storeEmitter.emit(action);
    return result;
  };

  store[IO] = {
    subscribe: storeEmitter.subscribe,
    dispatch: store.dispatch
  };

  return store[IO];
}

function runSaga(iterator, _ref) {
  var subscribe = _ref.subscribe;
  var dispatch = _ref.dispatch;
  var monitor = arguments.length <= 2 || arguments[2] === undefined ? _utils.noop : arguments[2];

  (0, _utils.check)(iterator, _utils.is.iterator, NOT_ITERATOR_ERROR);

  return (0, _proc2.default)(iterator, subscribe, dispatch, monitor);
}