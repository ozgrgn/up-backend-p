const bcrypt = require("bcrypt");
const { Invoice } = require("../model/index");
const { Product } = require("../../product/model/index");
const Service = require("../../services/service");

const addInvoice = async (invoiceDetail) => {
  invoiceDetail.fullName =
    invoiceDetail.client.name + " " + invoiceDetail.client.surname;
  if (invoiceDetail.invoiceSerial || invoiceDetail.invoiceNo)
    invoiceDetail.invoiceMerged =
      invoiceDetail.invoiceSerial + invoiceDetail.invoiceNo;

  const existInvoice = await Invoice.findOne({
    invoiceMerged: invoiceDetail.invoiceMerged,
  });
  console.log(existInvoice, "ddddd");
  if (existInvoice) {
    throw new Error("Bu Fatura No Daha Önce Kayıt Edilmiş");
  } else return new Invoice(invoiceDetail).save();
};

const getInvoices = async (query = {}, options = {}, user) => {
  const syncInvoice = await Service.syncInvoices();
  const { queryOptions } = options;
  if (query.fullName) {
    query.$or = [
      { fullName: { $regex: RegExp(query.fullName + ".*", "i") } },
      { invoiceMerged: { $regex: RegExp(query.fullName + ".*", "i") } },
    ];

    delete query.fullName;
    // query.fullName = { $regex: RegExp(query.fullName + ".*", "i") };
  }
 let invoices =[]
 console.log(query)
   invoices = await Invoice.find(query, {}, queryOptions)
    .populate("company")
    .sort({invoiceMerged:-1})
    .lean()
    .exec();
  const count = await Invoice.countDocuments(query);
  invoices.map((invoice, i) => {
    invoices[i].invoiceBrutTotal = 0;
    invoices[i].invoiceTotal = 0;
    invoice.details.map((detail, a) => {
      invoices[i].invoiceBrutTotal = invoices[i].invoiceBrutTotal + detail.productTotal;
      invoices[i].invoiceTotal = invoices[i].invoiceTotal + detail.productBrut;

    });
  });
  return { invoices, count };
};

const getInvoiceWithId = async (invoiceId) => {
  return Invoice.findById(invoiceId).populate("company").lean().exec();
};

const updateInvoiceWithById = async (invoiceId, invoice) => {
  console.log(invoice, "*invoice");
  invoice.fullName = invoice.client.name + " " + invoice.client.surname;
  invoice.invoiceMerged = invoice.invoiceSerial + invoice.invoiceNo;
  return Invoice.findByIdAndUpdate(invoiceId, invoice, { new: true });
};

const changeApproveStatus = async (
  invoiceId,
  status,
  reasonId,
  declineDate,
  approveDate,
  approveNo
) => {
  await Invoice.updateOne(
    { _id: invoiceId },
    {
      $set: {
        status: status,
        reasonId: reasonId,
        declineDate: declineDate,
        approveDate: approveDate,
        approveNo: approveNo,
      },
    }
  );
};

const getPerformance = async (query = {}, options = {}, user) => {
  const { queryOptions } = options;
  if (query.fullName) {
    query.$or = [
      { fullName: { $regex: RegExp(query.fullName + ".*", "i") } },
      { invoiceMerged: { $regex: RegExp(query.fullName + ".*", "i") } },
    ];

    delete query.fullName;
    // query.fullName = { $regex: RegExp(query.fullName + ".*", "i") };
  }

  if (query.noPending) {
    console.log(query.noPending);
  }
  const noPending = query.noPending;
  delete query.noPending;
  console.log(query);
  const invoices = await Invoice.find(query, {}, queryOptions).lean().exec();
  const pending = {};
  const confirmed = {};
  const declined = {};
  const total = {};
  pending.invoiceCount = 0;
  pending.brutTotal = 0;
  pending.total = 0;
  pending.kdv = 0;
  confirmed.invoiceCount = 0;
  confirmed.brutTotal = 0;
  confirmed.total = 0;
  confirmed.kdv = 0;
  declined.invoiceCount = 0;
  declined.brutTotal = 0;
  declined.total = 0;
  declined.kdv = 0;
  total.invoiceCount = 0;
  total.brutTotal = 0;
  total.total = 0;
  total.kdv = 0;
  invoices.map((invoice) => {
    if (invoice.status == "PENDING" && !noPending) {
      total.invoiceCount = total.invoiceCount + 1;
      pending.invoiceCount = pending.invoiceCount + 1;
      invoice.details.map((product) => {
        pending.brutTotal = pending.brutTotal + product.productBrut;
        pending.kdv = pending.kdv + product.productTotal - product.productBrut;
        pending.total = pending.total + product.productTotal;

        total.brutTotal = total.brutTotal + product.productBrut;
        total.kdv = total.kdv + product.productTotal - product.productBrut;
        total.total = total.total + product.productTotal;
      });
      pending.brutTotal = pending.brutTotal;
    }
    if (invoice.status == "CONFIRMED") {
      total.invoiceCount = total.invoiceCount + 1;
      confirmed.invoiceCount = confirmed.invoiceCount + 1;
      invoice.details.map((product) => {
        confirmed.brutTotal = confirmed.brutTotal + product.productBrut;
        confirmed.kdv =
          confirmed.kdv + product.productTotal - product.productBrut;
        confirmed.total = confirmed.total + product.productTotal;

        total.brutTotal = total.brutTotal + product.productBrut;
        total.kdv = total.kdv + product.productTotal - product.productBrut;
        total.total = total.total + product.productTotal;
      });
      confirmed.brutTotal = confirmed.brutTotal;
    }
    if (invoice.status == "DECLINED") {
      total.invoiceCount = total.invoiceCount + 1;
      declined.invoiceCount = declined.invoiceCount + 1;
      invoice.details.map((product) => {
        declined.brutTotal = declined.brutTotal + product.productBrut;
        declined.kdv =
          declined.kdv + product.productTotal - product.productBrut;
        declined.total = declined.total + product.productTotal;

        total.brutTotal = total.brutTotal + product.productBrut;
        total.kdv = total.kdv + product.productTotal - product.productBrut;
        total.total = total.total + product.productTotal;
      });
      declined.brutTotal = declined.brutTotal;
    }
  });

  return { pending, confirmed, declined, total };
};

const getProductReports = async (query = {}, options = {}, user) => {
  const { queryOptions } = options;
  if (query.fullName) {
    query.$or = [
      { fullName: { $regex: RegExp(query.fullName + ".*", "i") } },
      { invoiceMerged: { $regex: RegExp(query.fullName + ".*", "i") } },
    ];

    delete query.fullName;
    // query.fullName = { $regex: RegExp(query.fullName + ".*", "i") };
  }

  if (query.noPending) {
    console.log(query.noPending);
  }
  const noPending = query.noPending;
  delete query.noPending;
  console.log(query);
  const product = await Product.find().lean().exec();
  const invoices = await Invoice.find(query, {}, queryOptions).lean().exec();

  product.map((p, o) => {
    product[o].totalcount = 0;
    product[o].quantity = 0;
    product[o].productTotal = 0;
    product[o].productBrut = 0;
    p.product.map((pro, i) => {
      product[o].product[i].count = 0;
      product[o].product[i].quantity = 0;
      product[o].product[i].productTotal = 0;
      product[o].product[i].productBrut = 0;

      invoices.map((invoice) => {
        if (invoice.status == "CONFIRMED") {
          invoice.details.map((invproduct) => {
            console.log(invproduct.productId, pro._id);

            if (invproduct.productId == pro._id.toString()) {
              product[o].totalcount = product[o].totalcount + 1;
              product[o].quantity = product[o].quantity + invproduct.quantity;
              product[o].productBrut =
                product[o].productBrut + invproduct.productBrut;
              product[o].productTotal =
                product[o].productTotal + invproduct.productTotal;
              console.log(invproduct);
              product[o].product[i].quantity =
                product[o].product[i].quantity + invproduct.quantity;
              product[o].product[i].productTotal =
                product[o].product[i].productTotal + invproduct.productTotal;
              product[o].product[i].productBrut =
                product[o].product[i].productBrut + invproduct.productBrut;
              product[o].product[i].count = product[o].product[i].count + 1;
            }
          });
        }
      });
    });
  });

  return { product };
};

const getIcmal = async (query = {}, options = {}, user) => {
  const { queryOptions } = options;
  if (query.fullName) {
    query.$or = [
      { fullName: { $regex: RegExp(query.fullName + ".*", "i") } },
      { invoiceMerged: { $regex: RegExp(query.fullName + ".*", "i") } },
    ];

    delete query.fullName;
    // query.fullName = { $regex: RegExp(query.fullName + ".*", "i") };
  }
  const invoices = await Invoice.find(query, {}, queryOptions)
    .populate(["company", "terminalId","reasonId"])
    .lean()
    .exec();
  invoices.map((invoice, i) => {
    invoices[i].quantity = 0;
    invoices[i].productBrut = 0;
    invoices[i].productTotal = 0;
    invoice.details.map((product) => {
      invoices[i].quantity = invoices[i].quantity + product.quantity;
      invoices[i].productBrut = invoices[i].productBrut + product.productBrut;
      invoices[i].productTotal =
        invoices[i].productTotal + product.productTotal;
    });
  });
  const count = await Invoice.countDocuments(query);

  return { invoices, count };
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

const deleteInvoice = async (id) => {
  await Invoice.deleteOne({ _id: id });
  return true;
};

module.exports = {
  addInvoice,
  getInvoices,
  getInvoiceWithId,
  updateInvoiceWithById,
  changeApproveStatus,
  deleteInvoice,
  getPerformance,
  getProductReports,
  getIcmal,
};
