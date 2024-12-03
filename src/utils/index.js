"use strict";
const _ = require("lodash");

const getData = (object, fields = []) => {
  return _.pick(object, fields);
};

module.exports = {
  getData,
};
