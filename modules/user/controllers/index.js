const UserService = require("../services/index");
const promiseHandler = require("../../utilities/promiseHandler");
const _ = require("lodash");

const addUser = async (req, res) => {
  console.log(req.body)
  const [user_err, user] = await promiseHandler(
    UserService.addUser(req.body)
  );
  if (user_err) {
    return res.json({ status: false, message: user_err });
  }

  return res.json({ status: true, user });
};

const getUsers = async (req, res) => {
  const user = req.user;
  const {
    fullName,
    limit,
    sort,
    skip,
    group,
    status,
    userType
  } = req.query;
  const usersQuery = _.omitBy(
    {
      
      fullName,
      group,
      status,
      userType
    },
    (a) => a === undefined
  );

  const [users_err, users] = await promiseHandler(
    UserService.getUsers(
      usersQuery,
      {
        queryOptions: { limit, skip, status },
        sortOptions: sort ? JSON.parse(sort) : { fullName: -1 },
      },
      user
    )
  );

  if (users_err) {
    return res.json({ status: false, message: users_err });
  }

  return res.json({ status: true, ...users });
};

const getUserWithById = async (req, res) => {
  const [user_err, user] = await promiseHandler(
    UserService.getUserWithById(req.params.userId)
  );
  if (user_err) {
    return res.json({ status: false, message: user_err });
  }

  return res.json({ status: true, user });
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
const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  
  const [err, user] = await promiseHandler(
    UserService.deleteUser(userId)
  );

  if (err) {
    return res.json({ status: false, message: err });
  }

  return res.json({ status: true,user });
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



const getAgencies= async (req, res) => {
  const [users_err, users] = await promiseHandler(
    UserService.getAgencies()
  );
  if (users_err) {
    return res.json({ status: false, message: users_err });
  }

  return res.json({ status: true, users });
};
const getManagers= async (req, res) => {
  const [users_err, users] = await promiseHandler(
    UserService.getManagers()
  );
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
    UserService.changeStatusWithById(userId, newStatus,newUserStatus)
  );

  if (err) {
    return res.json({ status: false, message: err });
  }
  return res.json({ status: true, message: user });
};
module.exports = {
  addUser,
  getUsers,
  getUserWithById,
  updateUserWithById,
  deleteUser,

  changeUserStatusWithById,
  addReceiptWithById,
  getAgencies,
  getManagers,
  changeStatusWithById
};
