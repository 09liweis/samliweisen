const jwt = require("jsonwebtoken");
const { token_secret } = require("./constant");

exports.verify = (req, resp, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return resp.status(401).json({ msg: "Access Denied" });
  }
  try {
    const verified = jwt.verify(token, token_secret);
    req.user = verified;
    return next();
  } catch (error) {
    console.error(error);
    resp.status(400).json({ msg: "Invalid token" });
  }
};
exports.sign = (data) => {
  return jwt.sign(data, token_secret);
};
