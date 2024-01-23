const mongoose = require("mongoose");
const AuthModel = require("../../auth/model/index");
const STATUS = {
  STATUS_PENDING: "PENDING",
  STATUS_CONFIRMED: "CONFIRMED",
  STATUS_DECLINED: "DECLINED",
};
const UserSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId,
      ref: "companies",
      required: false, },
    branch: { type: String, required: false },
    username: { type: String, required: false },
    password: { type: String, required: false },
    email: { type: String, required: false },
    fullName: { type: String, required: true },
    tcNo: { type: String, required: false },
    phone: { type: String, required: false },
    email: { type: String, required: false },
    address: { type: String, required: false },
    status: { type: Boolean, required: false },
    userType: {
      type: String,
      enum: [
        AuthModel.TYPE_SUPERADMIN,
        AuthModel.TYPE_ADMIN,
        AuthModel.TYPE_USER,
      ],
      required: true,
    },
    userStatus: {
      type: String,
      enum: [
        STATUS.STATUS_CONFIRMED,
        STATUS.STATUS_DECLINED,
        STATUS.STATUS_PENDING,
      ],
      default: STATUS.STATUS_PENDING,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const User = mongoose.model("users", UserSchema);

module.exports = {
  User,
  UserSchema,
  ...STATUS,
};
