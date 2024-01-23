const ProductService = require("../services/index");
const promiseHandler = require("../../utilities/promiseHandler");
const _ = require("lodash");

const addCategory = async (req, res) => {
  console.log(req.body)
  const [category_err, category] = await promiseHandler(
    ProductService.addCategory(req.body)
  );
  if (category_err) {
    return res.json({ status: false, message: category_err });
  }

  return res.json({ status: true, category });
};

const getCategories= async (req, res) => {
  const [category_err, category] = await promiseHandler(
    ProductService.getCategories()
  );
  if (category_err) {
    return res.json({ status: false, message: category_err });
  }

  return res.json({ status: true, category });
};


const updateCategory = async (req, res) => {
  const [updated_category_err, updated_category] = await promiseHandler(
    ProductService.updateCategory(req.body.category)
  );
  if (updated_category_err) {
    return res.json({ status: false, message: updated_category_err });
  }

  return res.json({ status: true, updated_category });
};

const addProduct = async (req, res) => {
  const [product_err, product] = await promiseHandler(
    ProductService.updateProduct(req.params.category,req.body)
  );
  if (product_err) {
    return res.json({ status: false, message: product_err });
  }

  return res.json({ status: true, product });
};

const deleteCategory=async(req,res)=>{
  const[err,category] = await promiseHandler(
    ProductService.deleteCategory(req.params.id)
  );
  if(err) {
    return res.json({status:false,message:err});
  }
  return res.json({status:true,message:category})
};


module.exports = {
  addCategory,
  getCategories,
  updateCategory,
  addProduct,
  deleteCategory,
};
