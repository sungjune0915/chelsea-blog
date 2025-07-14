const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

//회원가입
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPw = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    await db.query(sql, [email, hashedPw]);

    // ✅ 회원가입 후 로그인 페이지로 이동
    res.redirect('/');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.send('❌ 이미 존재하는 이메일입니다.');
    } else {
      res.status(500).send('❗ 회원가입 중 오류 발생');
    }
  }
};

//로그인
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]); //mysql2/promise 구조에서는 [rows]로 받아야 합니다

    if (rows.length === 0) return res.send('❌ 이메일이 존재하지 않음');

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.send('❌ 비밀번호 틀림');

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });
    // ✅ index.ejs로 이동
    res.redirect('/');
  } catch (err) {
    res.status(500).send('❗ 로그인 중 오류 발생');
  }
};

//로그아웃
exports.logout = (req, res) => {
  res.clearCookie('token', { path: '/' }); // ✅ 쿠키 명시적으로 삭제
  res.redirect('/');                      // ✅ 메인 페이지로 이동
};

