// 목업 서버(src/_mock/mock-env.ts)와 같은 출처: config/.env.example(더미) + 셸 환경변수 우선.
// 실제 값이 든 config/.env.development 는 읽지 않는다.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');

function readEnv() {
  const env = {};
  for (const line of fs.readFileSync(path.join(ROOT, 'config', '.env.example'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = process.env[m[1]] !== undefined ? process.env[m[1]] : m[2];
  }
  return env;
}

// seed 는 DB 를 지우고 다시 만든다 → 로컬 DB 가 아니면 거부한다
function assertLocalDb(env) {
  if (!['127.0.0.1', 'localhost'].includes(env.DATABASE_HOST)) {
    throw new Error('목업 DB 스크립트는 DATABASE_HOST 가 127.0.0.1·localhost 일 때만 동작합니다.');
  }
}

module.exports = { ROOT, readEnv, assertLocalDb };
