"use strict";

const discountModel = require("../models/discount.model");
const { getUnselectData, getSelectData } = require("../utils");

const findAllDiscountsCodesUnselect = async ({
  limit,
  page,
  sort,
  filter,
  unselect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnselectData(unselect))
    .lean();

  return documents;
};

const findAllDiscountsCodesSelect = async ({
  limit,
  page,
  sort,
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return documents;
};

const checkDiscountExist = async(filter) => {
  const foundDiscount = await discountModel.findOne(filter).lean()
  return foundDiscount
}

module.exports = {
  findAllDiscountsCodesSelect,
  findAllDiscountsCodesUnselect,
  checkDiscountExist
};
