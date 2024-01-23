const bcrypt = require("bcrypt");
const { User } = require("../model/index");
const { create } = require("lodash");
const { async } = require("crypto-random-string");
const MailService = require("../../mail/services");
const mailConfig = require("../../../config.json");
const promiseHandler = require("../../utilities/promiseHandler");

const addUser = async (userDetails) => {
  console.log(userDetails.panelMail);
  if (userDetails.panelMail) {
    const [mail_err, mail] = await promiseHandler(
      MailService.sendMail({
        to: userDetails.email,
        from: `${mailConfig.globalName} <${mailConfig.auth.user}>`,
        mailOptions: {
          type: MailService.USER_MAIL,
          params: {
            name: userDetails.fullName,
            email: userDetails.email,
          },
        },
      })
    );
    if (mail_err) {
      return { status: false, message: mail_err };
    }
  }
  return new User(userDetails).save();
};

const getUsers = async (query = {}, options = {}, user) => {
  if (query.group) {
    query.group = JSON.parse(query.group);
  }
  console.log(query);
  const { queryOptions } = options;
  if (query.fullName) {
    query.fullName = { $regex: RegExp(query.fullName + ".*", "i") };
  }

  const users = await User.find(query, {}, queryOptions).populate('company').lean().exec();
  const count = await User.countDocuments(query);
  return { users, count };
};

const getUserWithById = async (userId) => {
  return User.findById(userId).populate('company').lean().exec();
};

const updateUserWithById = async (userId, user) => {
  if (user.password) {
    user.password = await hashPassword(user.password);
  }
  return User.findByIdAndUpdate(userId, user, { new: true });
};
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};
const getUsersOnlyIds = async (query = {}) => {
  return User.aggregate([
    {
      $match: {
        ...query,
      },
    },

    {
      $project: {
        _id: 0,
        user: "$_id",
      },
    },
  ]);
};
const changeUserStatusWithById = async (userId, userStatus) => {
  await User.updateOne({ _id: userId }, { userStatus: userStatus });

  return true;
};

const deleteUser = async (userId) => {
  await User.deleteOne({ _id: userId });
  return true;
};






const getAgencies = async () => {
  return User.find({ userType: "AGENCY" });
};
const getManagers = async () => {
  return User.find({ userType: { $ne: "AGENCY" } }).populate("country");
};

const changeStatusWithById = async (userId, newStatus, newUserStatus) => {
  if (newStatus!=undefined) {
    console.log(newStatus,"newstatus")


    await User.updateOne({ _id: userId }, { $set: { status: newStatus } });
    
  }
  if (newUserStatus) {
    await User.updateOne({ _id: userId }, { $set: { userStatus: newUserStatus } });
  }
};
module.exports = {
  addUser,
  getUsers,
  getUserWithById,
  updateUserWithById,
  deleteUser,
  getUsersOnlyIds,
  changeUserStatusWithById,
  getAgencies,
  getManagers,
  changeStatusWithById,
};
