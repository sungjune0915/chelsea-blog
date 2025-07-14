const express = require('express');
const router = express.Router();

const userViewControllers = require('../controllers/userViewControllers');
const userAuthControllers = require('../controllers/userAuthControllers');
const { verifyToken } = require('../middleware/auth');

// 기본 페이지들
router.get('/', userViewControllers.getHome);
router.get('/login', userViewControllers.loginForm);
router.get('/signup', userViewControllers.signUpForm);
router.get('/logout',userAuthControllers.logout);
router.get('/schedule', userViewControllers.getSchedulePage);
// 로그인, 회원가입,로그아웃웃
router.post('/login', userAuthControllers.login);
router.post('/signup', userAuthControllers.signup);

module.exports = router;

