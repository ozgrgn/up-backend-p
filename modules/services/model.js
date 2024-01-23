const mongoose = require("mongoose");

const OutsideInvoiceSchema = new mongoose.Schema(
  {
    uuid: { type: String, required: false },
    faturano: { type: String, required: false },
  },
  { timestamps: true }
);

const OutsideInvoice = mongoose.model("outside_invoices", OutsideInvoiceSchema);

module.exports = {
  OutsideInvoice,
};
