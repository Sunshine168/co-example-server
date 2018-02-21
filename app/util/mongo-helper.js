'use strict';

function counter(name, model) {
  const ret = model.findAndModify({
    query: { _id: name },
    update: { $inc: { next: 1 } },
    new: true,
    upsert: true,
  });
  return ret.next;
}

exports.counter = counter;
 