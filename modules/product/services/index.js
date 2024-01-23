const bcrypt = require("bcrypt");
const { Product } = require("../model/index");
const { create } = require("lodash");
const { async } = require("crypto-random-string");
const MailService = require("../../mail/services");
const mailConfig = require("../../../config.json");
const promiseHandler = require("../../utilities/promiseHandler");

const addCategory = async (name) => {
  console.log(name);
  return new Product(name).save();
};

const getCategories = async () => {
  return Product.find();
};



const updateCategory = async (category) => {
  return Product.findByIdAndUpdate(category._id,category, { new: true });
};

const updateProduct= async (category,product) => {
  console.log(category,product,"category and product")
  return Product.findByIdAndUpdate(category,product, { new: true });
};

const deleteCategory = async (id)=>{
  await Product.deleteOne({_id: id});
  return true;
}



module.exports = {
  addCategory,
  getCategories,
  updateCategory,
  updateProduct,
  deleteCategory,
  
};
