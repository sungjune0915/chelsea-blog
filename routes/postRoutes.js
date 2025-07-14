const express = require('express');
const router = express.Router();
const userPostControllers = require('../controllers/userPostControllers');
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../middleware/auth');


// 🔥 multer 저장 경로 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // 확장자 유지
  }
});
const upload = multer({ storage: storage });

// 🔥 게시판 관련
router.get('/post/:id', userPostControllers.postForm);
router.get('/write',userPostControllers.writeForm);
router.post('/savePost', verifyToken, userPostControllers.savePost);
// 🔥 Summernote 이미지 업로드용
router.post('/upload_image', upload.single('file'), userPostControllers.uploadImage);

module.exports = router;
