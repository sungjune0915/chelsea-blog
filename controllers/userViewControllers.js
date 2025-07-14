const axios = require('axios');
const dayjs = require('dayjs');
const db = require('../models/db');

exports.getHome = async (req, res) => {
  try {
    const response = await axios.get('https://api.football-data.org/v4/competitions/PL/standings', {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_API_KEY,
      },
    });
    const standings = response.data.standings[0].table; // 순위 테이블 배열
    const [posts] = await db.query(
      "SELECT * FROM posts WHERE category = '자유게시판' ORDER BY created_at DESC"
    );
    res.render('index', {
      posts,
      standings
    });
  } catch (err) {
    console.error('❌ 순위 API 실패:', err.message);
    res.render('index', { standings: [] }); // 오류 시 빈 배열
  }
};

exports.loginForm = (req,res) =>{
    res.render('login'); // views/login.ejs 를 렌더링
};

exports.signUpForm = (req, res) => {
  res.render('signUp'); // views/signUp.ejs 를 렌더링
};

exports.getSchedulePage = async (req, res) => {
  try {
    const teamId = 61; // 첼시 팀 ID
    const apiRes = await axios.get(`https://api.football-data.org/v4/teams/${teamId}/matches?season=2024&limit=100`, {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_API_KEY
      }
    });

    const matches = apiRes.data.matches;

    const events = matches.map(match => {
      const isHome = match.homeTeam.id === teamId;
      const opponent = isHome ? match.awayTeam.name : match.homeTeam.name;
      const title = isHome ? `Chelsea FC vs ${opponent}` : `${opponent} vs Chelsea FC`;
      const result = match.status === 'FINISHED'
        ? ` (결과: ${match.score.fullTime.home} - ${match.score.fullTime.away})`
        : '';
      const fullTitle = `${title}${result}`;

      return {
        title: fullTitle,
        start: dayjs(match.utcDate).format('YYYY-MM-DD'),
        color: match.status === 'FINISHED' ? '#28a745' : '#034694'
      };
    });

    res.render('schedule', { events });

  } catch (err) {
    console.error('❌ 경기 일정 로딩 실패:', err.message);
    res.render('schedule', { events: [] });
  }
};