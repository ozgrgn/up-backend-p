const bcrypt = require("bcrypt");
const {
  User,
  STATUS_PENDING,
  STATUS_CONFIRMED,
} = require("../../user/model/index");
const MailService = require("../../mail/services");
const mailConfig = require("../../../config.json");
const jsonwebtoken = require("jsonwebtoken");
const jwtSecretKey = require("../../../config.json").jwtConfig.secret;
const promiseHandler = require("../../utilities/promiseHandler");
const cryptoRandomString = require("crypto-random-string");
const signup = async (user) => {
 const existingUser = await User.findOne({ username: user.username});
if (existingUser) {
  throw new Error("Bu Kullanıcı Adı Alınmış. Lütfen Başka Bir Tane Deneyin");
}
  const password = await hashPassword(user.password);
 
  const savedUser = await new User({
    ...user,
    password,
    userStatus: STATUS_PENDING,
    status:true
  }).save();

}

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return hash;
};

const checkPassword = async (password, password2) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const check = await bcrypt.compare(password2, hash);

  return check;
};

const signupVerify = async (info) => {
  const user = await User.findById(info.userId);
  if (!user) {
    throw new Error("User not found");
  }

  
    user.userStatus = STATUS_CONFIRMED;
    user.emailAuthCode = undefined;
    await user.save();

    return { message: "Registiration is success." };
 
};

const login = async (username, password) => {
  console.log(username,password)
  const user = await User.findOne({ username });
  console.log(user)
  if (!user) {
    throw new Error("Kullanıcı Bulunamadı");
  }

  const compare = await bcrypt.compare(password, user.password);
  console.log(password,user.password,compare)
  if (!compare) {
    throw new Error("Hatalı Şifre");
  }

  const token = await jsonwebtoken.sign(
    { username, userId: user._id, userType: user.userType },
    jwtSecretKey
  );

  return { token, username, userId: user._id, fullName: user.fullName };
};

const permission = async (userId) => {
   return User.findOne({ _id: userId}, "userType");

};
module.exports = {
  signup,
  checkPassword,
  hashPassword,
  signupVerify,
  login,
  permission,
};
