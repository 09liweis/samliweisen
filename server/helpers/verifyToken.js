const jwt = require("jsonwebtoken");
const { token_secret } = require("./constant");

const ALLOWED_URLS = ["/statistics"];

exports.verify = (req, resp, next) => {
  const headerAuthorization = req.header("Authorization");
  const token = headerAuthorization && headerAuthorization.split(" ")[1];
  if (!token) {
    if (ALLOWED_URLS.includes(req.url) !== -1) {
      return next();
    }
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
