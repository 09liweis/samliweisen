const User = require('../models/user');
const bcrypt = require('bcrypt');
const {sign} = require('../helpers/verifyToken');
const {sendErr} = require('../helpers/request');

exports.list = (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(400).json({msg:'Login Required'});
  }
  const {roles} = user;
  if (!roles || roles.indexOf('admin') == -1) {
    return res.status(400).json({msg:'Admin Required'});
  }
  User.find({}, '_id eml nm lts created_at').sort('-created_at').exec((err, users) => {
    if (err) {
      return sendErr(res,err);
    }
    res.json(users);
  });
};
exports.register = async (req,resp)=>{
  console.log('register ',req.body);
  const {eml,nm,pwd} = req.body;
  let user = await User.findOne({eml})
  let msg = 'ok';
  if (user) {
    msg = 'Email is taken';
    return resp.status(400).json({msg});
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(pwd,salt);
    user = new User({
      eml,
      nm,
      pwd: hashPassword,
      lts: new Date()
    });
    console.log(user);
    await user.save()
    msg = 'Register done'
    const token = sign({_id:user._id});
    resp.header('auth-token',token);
    resp.status(200).json({msg,token});
  }
}
exports.login = async (req, resp) => {
  const {eml,pwd} = req.body;
  let user = await User.findOne({eml},'_id roles pwd');
  if (!user) {
    return resp.status(400).json({msg:'Email does not exist'});
  }
  const isValidPwd = await bcrypt.compare(pwd,user.pwd);
  if (!isValidPwd) {
    return resp.status(400).json({msg:'Password not correct'});
  }
  const token = sign({_id:user._id,roles:user.roles});
  await User.updateOne({eml},{$set:{lts:new Date()}});
  resp.header('auth-token',token);
  resp.status(200).json({msg:'Login',token});
}
exports.detail = async (req,resp) => {
  let user = req.user;
  if (user) {
    user = await User.findOne({_id:user._id},'nm eml lts roles');
    if (roles.includes('admin')) {
      user.isAdmin = true;
    }
    resp.status(200).json({user}); 
  }
}