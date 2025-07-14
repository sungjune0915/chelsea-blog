const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send('🔒 로그인 필요!');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // 이후 req.user로 로그인한 유저 정보 사용 가능
    next(); // 다음 미들웨어로
  } catch (err) {
    return res.status(403).send('❌ 유효하지 않은 토큰입니다.');
  }
};
