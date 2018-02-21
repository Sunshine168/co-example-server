'use strict';

module.exports = app => {
  const { mongolass } = app;
  const Counter = mongolass.model('Counter', {
    sequenceValue: { type: 'number' },
    _id: { type: 'string' },
  });
  Counter.index({ _id: 1 }).exec();
  return Counter;
};
