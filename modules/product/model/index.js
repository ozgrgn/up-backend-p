const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    category: { type: String, required: false },
    subCategory:{ type: String, required: false },
    product: [
      {
        name: { type: String, required: false },
        kdv: { type: Number, required: false },
        type: { type: String, required: false }
      },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Product = mongoose.model("products", ProductSchema);

module.exports = {
  Product,
};
