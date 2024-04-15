const User = require("../models/user");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { sign } = require("../helpers/verifyToken");
const { sendErr } = require("../helpers/request");

exports.list = (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(400).json({ msg: "Login Required" });
  }
  const { roles } = user;
  if (!roles || roles.indexOf("admin") == -1) {
    return res.status(400).json({ msg: "Admin Required" });
  }
  User.find({}, "_id eml nm lts created_at")
    .sort("-created_at")
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      return sendErr(res, err);
    });
};
exports.register = async (req, resp) => {
  console.log("register ", req.body);
  const { eml, nm, pwd } = req.body;
  let user = await User.findOne({ eml });
  let msg = "ok";
  if (user) {
    msg = "Email is taken";
    return resp.status(400).json({ msg });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(pwd, salt);
    user = new User({
      eml,
      nm,
      pwd: hashPassword,
      lts: new Date(),
    });
    console.log(user);
    await user.save();
    msg = "Register done";
    const token = sign({ _id: user._id });
    resp.header("auth-token", token);
    resp.status(200).json({ msg, token });
  }
};
exports.login = async (req, resp) => {
  const { eml, pwd } = req.body;
  let user = await User.findOne({ eml }, "_id roles pwd");
  if (!user) {
    return resp.status(400).json({ msg: "Email does not exist" });
  }
  const isValidPwd = await bcrypt.compare(pwd, user.pwd);
  if (!isValidPwd) {
    return resp.status(400).json({ msg: "Password not correct" });
  }
  const token = sign({ _id: user._id, roles: user.roles });
  await User.updateOne({ eml }, { $set: { lts: new Date() } });
  resp.header("auth-token", token);
  resp.status(200).json({ msg: "Login", token });
};
exports.detail = async (req, resp) => {
  let user = req.user;
  if (user) {
    user = await User.findOne({ _id: user._id }, "nm eml lts roles githubId");
    if (user.roles && user.roles.includes("admin")) {
      user.isAdmin = true;
    }
    resp.status(200).json({ user });
  }
};

const clientID = "105591674a9b55dc8196";
const clientSecret = "4e0ad6229531df62c9ca3bf7fc027364f9c33c11";

exports.authThirdParty = async (req, resp) => {
  const { requestToken } = req.body;

  axios({
    method: "post",
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
      accept: "application/json",
    },
  }).then((response) => {
    const access_token = response.data.access_token;
    axios({
      method: "get",
      url: `https://api.github.com/user`,
      headers: {
        Authorization: "token " + access_token,
      },
    }).then((response) => {
      const userData = response.data;
      const { email, name, id } = userData;
      User.findOneAndUpdate(
        { eml: email },
        { eml: email, nm: name, githubId: id },
        { returnNewDocument: true, upsert: true },
        (err, user) => {
          const token = sign({ _id: user._id, roles: user.roles });
          resp.header("auth-token", token);
          resp.status(200).json({ token });
        },
      );
    });
  });
};
