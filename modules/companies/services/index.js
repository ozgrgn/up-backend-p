const { Company } = require("../model/index");
const { Invoice } = require("../../invoice/model/index");

const getCompanies = async () => {
  return Company.find();
};

const addCompany = async (name) => {
  console.log(name);
  return new Company({ name: name }).save();
};

const deleteCompany = async (id) => {
  const companyInvoice = await Invoice.findOne({ company: id });

  if (companyInvoice) {
    throw new Error("There is Invoice");
  } else await Company.deleteOne({ _id: id });
  return true;
};

const getCompany = async (campaignId) => {
  return Company.findById(campaignId);
};
const updateCompany = async (company) => {
  return Company.findByIdAndUpdate(company._id, company, { new: true });
};
module.exports = {
  getCompanies,
  addCompany,
  deleteCompany,
  getCompany,
  updateCompany,
};
