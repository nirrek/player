/* @flow */
import { take, cancel, fork } from 'redux-saga';

// Produces a generator that only allows one concurrent subtask at a time.
// If a second actionType is received while the first subtask is still in
// progress the first subtask will be automatically cancelled.
export function takeLatest(actionType: string, subtask: Generator,
  ...subtaskArgs: Array<any>): Iterator {
  return (function* () {
    let action, task;
    while (action = yield take(actionType)) {
      if (task) yield cancel(task);
      task = yield fork(subtask, action, ...subtaskArgs);
    }
  })();
};

export function delay(ms: number): Promise {
  return new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  });
}
