const mysql = require('mysql2/promise');

// .env에서 값 가져오기
const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;

// 풀 생성
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 연결 테스트 (서버 시작 시 한 번만 실행)
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL 연결 성공!');
    conn.release(); // 풀에 반납
  } catch (err) {
    console.error('❌ MySQL 연결 실패', err);
  }
})();

module.exports = pool;
