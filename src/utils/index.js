"use strict";
const _ = require("lodash");
const { Types } = require("mongoose");
const getData = (object, fields = []) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnselectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeFalselyObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null) {
      delete obj[key];
    }
  });
  return obj;
};

const updateNestedObjectParser = (obj) => {
  const result = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "Object" && !Array.isArray(obj[key])) {
      const response = updateNestedObjectParser(obj[key]);
      Object.keys(response).forEach((a) => {
        response[`${key}.${a}`] == response[a];
      });
    } else {
      result[key] = obj[key``];
    }
  });

  return result;
};

const convertToObjectIdMongodb = (id) => {
  return Types.Object(id);
};

module.exports = {
  getData,
  getSelectData,
  getUnselectData,
  removeFalselyObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
};
