// 목업 DB 재생성: DATABASE_SCHEMA 를 지우고 schema.sql + fixtures 를 넣는다(로컬 DB 만).
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const { readEnv, assertLocalDb } = require('./env');
const { build, DEMO_PASSWORD } = require('./fixtures');

const env = readEnv();
assertLocalDb(env);
const db = env.DATABASE_SCHEMA;

const conn = mysql.createConnection({
  host: env.DATABASE_HOST,
  port: Number(env.DATABASE_PORT),
  user: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  charset: 'utf8mb4',
  timezone: 'Z',
  multipleStatements: true,
});
const q = (sql, values) => new Promise((ok, ng) => conn.query(sql, values, (e, r) => (e ? ng(e) : ok(r))));

(async () => {
  await q('DROP DATABASE IF EXISTS ??; CREATE DATABASE ?? CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci; USE ??', [db, db, db]);
  await q(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

  const tables = build({
    now: new Date(),
    imgBase: `http://localhost:${env.SERVER_PORT}/_mock/assets/img`,
    passwordHash: bcrypt.hashSync(DEMO_PASSWORD, 10),
  });
  for (const [table, rows] of tables) {
    for (const row of rows) await q('INSERT INTO ?? SET ?', [table, row]);
  }
  const counts = tables.map(([t, rows]) => `${t} ${rows.length}`).join(', ');
  console.log(`[mock-db] ${db} 재생성 완료: ${counts}`);
  console.log(`[mock-db] 데모 로그인: demo@example.com / ${DEMO_PASSWORD}`);
})()
  .catch((e) => {
    console.error('[mock-db] seed 실패:', e.code || '', e.sqlMessage || e.message);
    if (e.code === 'ECONNREFUSED') console.error('[mock-db] 먼저 npm run mock:db 로 MySQL 을 띄우세요.');
    process.exitCode = 1;
  })
  .finally(() => conn.end());
