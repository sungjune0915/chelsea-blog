// middlewares/checkLogin.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.checkLogin = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.locals.isLogin = false;
    return next();
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.locals.isLogin = true;
    res.locals.user = decoded;
    next();
  } catch (err) {
    res.locals.isLogin = false;
    next();
  }
};
