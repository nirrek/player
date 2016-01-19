'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

var _proc = require('./proc');

var _proc2 = _interopRequireDefault(_proc);

var _emitter = require('./emitter');

var _emitter2 = _interopRequireDefault(_emitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  for (var _len = arguments.length, sagas = Array(_len), _key = 0; _key < _len; _key++) {
    sagas[_key] = arguments[_key];
  }

  return function (_ref) {
    var getState = _ref.getState;
    var dispatch = _ref.dispatch;

    var sagaEmitter = (0, _emitter2.default)();

    sagas.forEach(function (saga) {
      (0, _proc2.default)(saga(getState, dispatch), sagaEmitter.subscribe, dispatch, function (action) {
        return (0, _utils.asap)(function () {
          return dispatch(action);
        });
      }, 0, saga.name);
    });

    return function (next) {
      return function (action) {
        var result = next(action); // hit reducers
        sagaEmitter.emit(action);
        return result;
      };
    };
  };
};
