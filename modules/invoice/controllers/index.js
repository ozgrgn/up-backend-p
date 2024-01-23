const InvoiceService = require("../services/index");
const promiseHandler = require("../../utilities/promiseHandler");
const _ = require("lodash");

const addInvoice = async (req, res) => {
  const [invoice_err, invoice] = await promiseHandler(
    InvoiceService.addInvoice(req.body)
  );
  if (invoice_err) {
    return res.json({ status: false, message: invoice_err });
  }

  return res.json({ status: true, invoice });
};

const getInvoices = async (req, res) => {
  const invoice = req.invoice;
  const {
    invoiceNo,
    fullName,
    status,
    company,
    branch,
    invoiceDate1,
    invoiceDate2,
    approveDate1,
    approveDate2,
    deparDate1,
    deparDate2,
    reason,
    limit,
    sort,
    skip,
  } = req.query;
  const invoiceQuery = _.omitBy(
    {
      invoiceNo,
      fullName,
      status,
      company,
      branch,

      invoiceDate:
        invoiceDate1 || invoiceDate2
          ? {
              $gte: invoiceDate1
                ? invoiceDate1
                : new Date("1970-01-01").toISOString(),
              $lte: invoiceDate2 ? invoiceDate2 : new Date().toISOString(),
            }
          : undefined,
      approveDate:
        approveDate1 || approveDate2
          ? {
              $gte: approveDate1
                ? approveDate1
                : new Date("1970-01-01").toISOString(),
              $lte: approveDate2 ? approveDate2 : new Date().toISOString(),
            }
          : undefined,
      deparDate:
        deparDate1 || deparDate2
          ? {
              $gte: deparDate1
                ? deparDate1
                : new Date("1970-01-01").toISOString(),
              $lte: deparDate2 ? deparDate2 : new Date().toISOString(),
            }
          : undefined,
      reason,
    },
    (a) => a === undefined
  );


  const [invoices_err, invoices] = await promiseHandler(
    InvoiceService.getInvoices(invoiceQuery, {
      queryOptions: { limit, skip },
      sortOptions: sort ? JSON.parse(sort) : { invoiceNo: -1 },
    })
  );

  if (invoices_err) {
    return res.json({ status: false, message: invoices_err });
  }

  return res.json({ status: true, ...invoices });
};

const getInvoiceWithId = async (req, res) => {
  const [invoice_err, invoice] = await promiseHandler(
    InvoiceService.getInvoiceWithId(req.params.invoiceId)
  );
  if (invoice_err) {
    return res.json({ status: false, message: invoice_err });
  }

  return res.json({ status: true, invoice });
};

const updateInvoiceWithById = async (req, res) => {
  const [updated_invoice_err, updated_invoice] = await promiseHandler(
    InvoiceService.updateInvoiceWithById(req.params.invoiceId, req.body.invoice)
  );
  if (updated_invoice_err) {
    return res.json({ status: false, message: updated_invoice_err });
  }

  return res.json({ status: true, updated_invoice });
};

const changeApproveStatus = async (req, res) => {
  const invoiceId = req.params.invoiceId;
  const status = req.body.status;
  const reasonId = req.body.reasonId;
  const declineDate = req.body.declineDate;
  const approveDate = req.body.approveDate;
  const approveNo = req.body.approveNo;

  const [err, user] = await promiseHandler(
    InvoiceService.changeApproveStatus(
      invoiceId,
      status,
      reasonId,
      declineDate,
      approveDate,
      approveNo
    )
  );

  if (err) {
    return res.json({ status: false, message: err });
  }
  return res.json({ status: true, message: user });
};

const deleteInvoice = async (req, res) => {
  const id = req.params.id;

  const [err, invoice] = await promiseHandler(InvoiceService.deleteInvoice(id));

  if (err) {
    return res.json({ status: false, message: err });
  }

  return res.json({ status: true, invoice });
};

const getPerformance = async (req, res) => {
  const invoice = req.invoice;
  const {
    invoiceNo,
    fullName,
    noPending,
    status,
    company,
    branch,
    invoiceDate1,
    invoiceDate2,
    approveDate1,
    approveDate2,
    deparDate1,
    deparDate2,
    reason,
    limit,
    sort,
    skip,
  } = req.query;
  const invoiceQuery = _.omitBy(
    {
      invoiceNo,
      fullName,
      status,
      company,
      branch,
      noPending,

      invoiceDate:
        invoiceDate1 || invoiceDate2
          ? {
              $gte: invoiceDate1
                ? invoiceDate1
                : new Date("1970-01-01").toISOString(),
              $lte: invoiceDate2 ? invoiceDate2 : new Date().toISOString(),
            }
          : undefined,
      approveDate:
        approveDate1 || approveDate2
          ? {
              $gte: approveDate1
                ? approveDate1
                : new Date("1970-01-01").toISOString(),
              $lte: approveDate2 ? approveDate2 : new Date().toISOString(),
            }
          : undefined,

      deparDate:
        deparDate1 || deparDate2
          ? {
              $gte: deparDate1
                ? deparDate1
                : new Date("1970-01-01").toISOString(),
              $lte: deparDate2 ? deparDate2 : new Date().toISOString(),
            }
          : undefined,
      reason,
    },
    (a) => a === undefined
  );
  const [invoices_err, invoices] = await promiseHandler(
    InvoiceService.getPerformance(invoiceQuery, {
      queryOptions: { limit, skip },
      sortOptions: sort ? JSON.parse(sort) : { name: -1 },
    })
  );

  if (invoices_err) {
    return res.json({ status: false, message: invoices_err });
  }

  return res.json({ status: true, ...invoices });
};

const getProductReports = async (req, res) => {
  const invoice = req.invoice;
  const {
    invoiceNo,
    fullName,
    noPending,
    status,
    company,
    branch,
    invoiceDate1,
    invoiceDate2,
    approveDate1,
    approveDate2,
    deparDate1,
    deparDate2,
    product,
    reason,
    limit,
    sort,
    skip,
  } = req.query;
  const invoiceQuery = _.omitBy(
    {
      invoiceNo,
      fullName,
      status,
      company,
      branch,
      noPending,

      "details.productId": product,

      invoiceDate:
        invoiceDate1 || invoiceDate2
          ? {
              $gte: invoiceDate1
                ? invoiceDate1
                : new Date("1970-01-01").toISOString(),
              $lte: invoiceDate2 ? invoiceDate2 : new Date().toISOString(),
            }
          : undefined,
      approveDate:
        approveDate1 || approveDate2
          ? {
              $gte: approveDate1
                ? approveDate1
                : new Date("1970-01-01").toISOString(),
              $lte: approveDate2 ? approveDate2 : new Date().toISOString(),
            }
          : undefined,

      deparDate:
        deparDate1 || deparDate2
          ? {
              $gte: deparDate1
                ? deparDate1
                : new Date("1970-01-01").toISOString(),
              $lte: deparDate2 ? deparDate2 : new Date().toISOString(),
            }
          : undefined,
      reason,
    },
    (a) => a === undefined
  );

  const [invoices_err, invoices] = await promiseHandler(
    InvoiceService.getProductReports(invoiceQuery, {
      queryOptions: { limit, skip },
      sortOptions: sort ? JSON.parse(sort) : { name: -1 },
    })
  );

  if (invoices_err) {
    return res.json({ status: false, message: invoices_err });
  }

  return res.json({ status: true, ...invoices });
};

const updateUserWithById = async (req, res) => {
  const [updated_user_err, updated_user] = await promiseHandler(
    UserService.updateUserWithById(req.params.userId, req.body.user)
  );
  if (updated_user_err) {
    return res.json({ status: false, message: updated_user_err });
  }

  return res.json({ status: true, updated_user });
};
const changeUserStatusWithById = async (req, res) => {
  const userId = req.params.userId;
  const userStatus = req.body.userStatus;

  const [err, user] = await promiseHandler(
    UserService.changeUserStatusWithById(userId, userStatus)
  );

  if (err) {
    return res.json({ status: false, message: err });
  }

  const [user_err, updated_user] = await promiseHandler(
    UserService.changeUserStatusWithById(userId, userStatus)
  );

  if (user_err) {
    return res.json({ status: false, message: user_err });
  }
  return res.json({ status: true });
};

const addReceiptWithById = async (req, res) => {
  const userId = req.params.userId;
  const receiptDate = req.body.receiptDate;
  const description = req.body.description;
  const amount = req.body.amount;

  const [err, user] = await promiseHandler(
    UserService.addReceiptWithById(userId, receiptDate, description, amount)
  );

  if (err) {
    return res.json({ status: false, message: err });
  }

  return res.json({ status: true });
};

const getAgencies = async (req, res) => {
  const [users_err, users] = await promiseHandler(UserService.getAgencies());
  if (users_err) {
    return res.json({ status: false, message: users_err });
  }

  return res.json({ status: true, users });
};
const getManagers = async (req, res) => {
  const [users_err, users] = await promiseHandler(UserService.getManagers());
  if (users_err) {
    return res.json({ status: false, message: users_err });
  }

  return res.json({ status: true, users });
};

const changeStatusWithById = async (req, res) => {
  const userId = req.params.userId;
  const newStatus = req.body.newStatus;
  const newUserStatus = req.body.newUserStatus;

  const [err, user] = await promiseHandler(
    UserService.changeStatusWithById(userId, newStatus, newUserStatus)
  );

  if (err) {
    return res.json({ status: false, message: err });
  }
  return res.json({ status: true, message: user });
};
const getIcmal = async (req, res) => {
  const invoice = req.invoice;
  const {
    invoiceNo,
    fullName,
    status,
    company,
    branch,
    invoiceDate1,
    invoiceDate2,
    approveDate1,
    approveDate2,
    deparDate1,
    deparDate2,
    reason,
    limit,
    sort,
    skip,
  } = req.query;
  const invoiceQuery = _.omitBy(
    {
      invoiceNo,
      fullName,
      status,
      company,
      branch,

      invoiceDate:
        invoiceDate1 || invoiceDate2
          ? {
              $gte: invoiceDate1
                ? invoiceDate1
                : new Date("1970-01-01").toISOString(),
              $lte: invoiceDate2 ? invoiceDate2 : new Date().toISOString(),
            }
          : undefined,
      approveDate:
        approveDate1 || approveDate2
          ? {
              $gte: approveDate1
                ? approveDate1
                : new Date("1970-01-01").toISOString(),
              $lte: approveDate2 ? approveDate2 : new Date().toISOString(),
            }
          : undefined,
      deparDate:
        deparDate1 || deparDate2
          ? {
              $gte: deparDate1
                ? deparDate1
                : new Date("1970-01-01").toISOString(),
              $lte: deparDate2 ? deparDate2 : new Date().toISOString(),
            }
          : undefined,
      reason,
    },
    (a) => a === undefined
  );

  const [invoices_err, invoices] = await promiseHandler(
    InvoiceService.getIcmal(invoiceQuery, {
      queryOptions: { limit, skip },
      sortOptions: sort ? JSON.parse(sort) : { name: -1 },
    })
  );

  if (invoices_err) {
    return res.json({ status: false, message: invoices_err });
  }

  return res.json({ status: true, ...invoices });
};

module.exports = {
  addInvoice,
  getInvoices,
  getInvoiceWithId,
  updateUserWithById,
  updateInvoiceWithById,
  changeApproveStatus,
  deleteInvoice,
  getPerformance,
  getProductReports,
  changeUserStatusWithById,
  addReceiptWithById,
  getIcmal,
  getAgencies,
  getManagers,
  changeStatusWithById,
};
