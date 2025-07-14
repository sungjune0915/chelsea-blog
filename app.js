const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
require('dotenv').config();

const { checkLogin } = require('./middleware/checkLogin');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ 로그인 상태 확인 미들웨어 반드시 등록!
app.use(cookieParser());
app.use(checkLogin);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
app.use('/', userRoutes);
app.use('/board', postRoutes);

app.listen(8080, () => {
  console.log('✅ Server running on http://localhost:8080');
});
