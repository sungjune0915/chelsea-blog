const db = require('../models/db');
const axios = require('axios');
const cheerio = require('cheerio');
// 글 저장
exports.postForm = async (req, res) => {
  const postId = req.params.id;
    try {
        const response = await axios.get('https://api.football-data.org/v4/competitions/PL/standings', {
        headers: {
            'X-Auth-Token': process.env.FOOTBALL_API_KEY,
        },
        });
        const standings = response.data.standings[0].table; // 순위 테이블 배열
        const [[post]] = await db.query('SELECT * FROM posts WHERE id = ?', [postId]);
        if (!post) {return res.status(404).send('게시물을 찾을 수 없습니다.');}
        res.render('post', {
        standings, // EJS에 전달
        post
        });
    } catch (err) {
        console.error('❌ 순위 API 실패:', err.message);
        res.status(500).send('서버 오류');
    }
};

exports.savePost = async (req, res) => {
  const { title, content, category } = req.body;
  const author = req.user?.email || '익명';

  // 💡 HTML 파싱해서 class 삽입
  const $ = cheerio.load(content);

  $('p').each((i, el) => {
    $(el).addClass('fs-5 mb-4');
  });

  $('img').each((i, el) => {
    $(el).addClass('img-fluid rounded');
  });

  const updatedContent = $.html(); // 변경된 HTML 추출

  try {
    await db.query(
      'INSERT INTO posts (title, content, author, category) VALUES (?, ?, ?, ?)',
      [title, updatedContent, author, category]
    );
    res.redirect('/');
  } catch (err) {
    console.error('❌ 글 저장 중 오류:', err);
    res.status(500).send('서버 오류 발생');
  }
};

// Summernote 이미지 업로드
exports.uploadImage = (req, res) => {
    if (!req.file) {
      return res.status(400).send('이미지 업로드 실패');
    }
  
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl }); // Summernote가 이 URL로 <img> 삽입
  };

  exports.writeForm = (req, res) => {
    res.render('write'); // views/signUp.ejs 를 렌더링
  };  