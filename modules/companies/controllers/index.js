const CompanyService = require("../services/index");
const promiseHandler = require("../../utilities/promiseHandler");
const _ = require("lodash");
// Companies
const getCompanies = async (req, res) => {
  console.log("getcompanies")
  const [company_err, companies] = await promiseHandler(
    CompanyService.getCompanies()
  );
  if (company_err) {
    return res.json({ status: false, message: company_err });
  }

  return res.json({ status: true, companies });
};

const addCompany = async (req, res) => {
  console.log(req.body);
  const [company_err, company] = await promiseHandler(
    CompanyService.addCompany(req.body.name)
  );
  if (company_err) {
    return res.json({ status: false, message: company_err });
  }

  return res.json({ status: true, company });
};

const deleteCompany= async (req, res) => {
  const [err, company] = await promiseHandler(
    CompanyService.deleteCompany(req.params.id)
  );
  if (err) {
    return res.json({ status: false, message: err });
  }
  return res.json({ status: true, message: company });
};
const getCompany = async (req, res) => {
  const [company_err, company] = await promiseHandler(
    CompanyService.getCompany(req.params.companyId)
  );
  if (company_err) {
    return res.json({ status: false, message: company_err });
  }

  return res.json({ status: true, company });
};

const updateCompany = async (req, res) => {
  const [updated_company_err, updated_company] = await promiseHandler(
    CompanyService.updateCompany(req.body.company)
  );
  if (updated_company_err) {
    return res.json({ status: false, message: updated_company_err });
  }

  return res.json({ status: true, updated_company });
};




// Branches
const getBranches = async (req, res) => {
  const [branch_err, branches] = await promiseHandler(
    CompanyService.getBranches()
  );
  if (branch_err) {
    return res.json({ status: false, message: branch_err });
  }

  return res.json({ status: true, branches });
};

const addBranch = async (req, res) => {
  console.log(req.body);
  const [branch_err, branch] = await promiseHandler(
    CompanyService.addBranch(req.body.branch)
  );
  if (branch_err) {
    return res.json({ status: false, message: branch_err });
  }

  return res.json({ status: true, branch });
};

const deleteBranch= async (req, res) => {
  const [err, branch] = await promiseHandler(
    CompanyService.deleteBranch(req.params.id)
  );
  if (err) {
    return res.json({ status: false, message: err });
  }
  return res.json({ status: true, message: branch });
};




module.exports = {
  getCompanies,
  addCompany,
  deleteCompany,
  getCompany,
  updateCompany,
  
  getBranches,
  addBranch,
  deleteBranch

  
};
