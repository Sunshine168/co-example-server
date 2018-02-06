'use strict';

const formidable = require('formidable');

function formidablePromise(req, opts) {
  return new Promise(function(resolve, reject) {
    const form = new formidable.IncomingForm(opts);
    form.parse(req, function(err, fields, files) {
      if (err) return reject(err);
      resolve({
        fields,
        files,
      });
    });
  });
}

module.exports = formidablePromise;
