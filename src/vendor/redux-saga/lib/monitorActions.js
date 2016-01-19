'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.effectTriggered = effectTriggered;
exports.effectResolved = effectResolved;
exports.effectRejected = effectRejected;
var EFFECT_TRIGGERED = exports.EFFECT_TRIGGERED = 'EFFECT_TRIGGERED';
var EFFECT_RESOLVED = exports.EFFECT_RESOLVED = 'EFFECT_RESOLVED';
var EFFECT_REJECTED = exports.EFFECT_REJECTED = 'EFFECT_REJECTED';

function effectTriggered(effectId, parentEffectId, label, effect) {
  return {
    type: EFFECT_TRIGGERED,
    effectId: effectId, parentEffectId: parentEffectId, label: label, effect: effect
  };
}

function effectResolved(effectId, result) {
  return {
    type: EFFECT_RESOLVED,
    effectId: effectId, result: result
  };
}

function effectRejected(effectId, error) {
  return {
    type: EFFECT_REJECTED,
    effectId: effectId, error: error
  };
}