const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    branches: [
      {
        name: { type: String, required: false }
      },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Company = mongoose.model("companies", CompanySchema);



// const BranchSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },

//   },
//   { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
// );

// const Branch = mongoose.model("branches", BranchSchema);



module.exports = {
  Company
};
