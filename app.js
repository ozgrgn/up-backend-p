const config = require("./config.json");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const booleanParser = require("express-query-boolean");
const app = express();
const http = require("http").createServer(app);
const moment = require("moment-timezone");
moment.tz.setDefault("Europe/Istanbul");

const jwtParser = require("./modules/auth/middlewares/jwt-parser");
app.use(jwtParser);

app.use(booleanParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", true);

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, POST, PATCH, GET, DELETE, OPTIONS"
  );
  next();
});

//routes
const userRouter = require("./modules/user/routes");
const authRouter = require("./modules/auth/routes");
const invoiceRouter = require("./modules/invoice/routes");
const productRouter = require("./modules/product/routes");
const othersRouter = require("./modules/others/routes");
const companiesRouter = require("./modules/companies/routes");
const servicesRouter = require("./modules/services/routes");

//////////////
//////////////
//////////////
//////////////

// app.use("/place", placeRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/invoice", invoiceRouter);
app.use("/others", othersRouter);
app.use("/companies", companiesRouter);
app.use("/services", servicesRouter);


  app.get("/", async (req, res) => {
  res.json({});
});
mongoose
  .connect(config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.error(err);
  });
http.listen(process.env.PORT || 3000, (error) => {
  if (error) {
    throw error;
  }
  console.log(`listening on ${process.env.PORT || 3000}`);
});
