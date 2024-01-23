const mailer = require("nodemailer");
const { auth } = require("../../config.json");

module.exports.transport = mailer.createTransport({
  direct: true,
  host: "lin15.isimtescil.net",
  port: 465,
  auth,
  secure: true,
});
