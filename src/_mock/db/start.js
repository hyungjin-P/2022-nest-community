// 목업 MySQL 8.0 을 포그라운드로 띄운다. 첫 실행 때 .mock/mysql-data 를 초기화한다.
// mysqld 위치: 환경변수 MYSQL_HOME(압축을 푼 폴더) 또는 PATH
const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const { ROOT, readEnv, assertLocalDb } = require('./env');

const env = readEnv();
assertLocalDb(env);

const exe = process.platform === 'win32' ? 'mysqld.exe' : 'mysqld';
const mysqld = process.env.MYSQL_HOME ? path.join(process.env.MYSQL_HOME, 'bin', exe) : exe;
const baseArgs = ['--no-defaults'];
if (process.env.MYSQL_HOME) baseArgs.push(`--basedir=${process.env.MYSQL_HOME}`);
const datadir = path.join(ROOT, '.mock', 'mysql-data');

// mysql 2.18 드라이버는 mysql_native_password 만 지원한다(caching_sha2_password 불가)
const AUTH = '--default-authentication-plugin=mysql_native_password';

if (!fs.existsSync(datadir)) {
  fs.mkdirSync(path.dirname(datadir), { recursive: true });
  console.log(`[mock-db] ${datadir} 초기화`);
  const init = spawnSync(mysqld, [...baseArgs, '--initialize-insecure', AUTH, `--datadir=${datadir}`, '--console'], {
    stdio: 'inherit',
  });
  if (init.error || init.status !== 0) {
    console.error('[mock-db] 초기화 실패', init.error || `exit ${init.status}`);
    fs.rmSync(datadir, { recursive: true, force: true });
    process.exit(1);
  }
}

const args = [
  ...baseArgs,
  AUTH,
  `--datadir=${datadir}`,
  `--port=${env.DATABASE_PORT}`,
  '--bind-address=127.0.0.1',
  '--mysqlx=OFF',
  // 원본 typeorm.config.ts 의 timezone 'Z' 와 맞춘다. 서버 시간대가 다르면 CURRENT_TIMESTAMP 기본값이 어긋난다
  '--default-time-zone=+00:00',
  // magazine-tag.repository.ts 의 GROUP BY 가 ONLY_FULL_GROUP_BY 에서 실패한다. RDS 기본 파라미터 그룹 값으로 둔다(가정)
  '--sql-mode=NO_ENGINE_SUBSTITUTION',
  '--character-set-server=utf8mb4',
  '--console',
];
console.log(`[mock-db] ${mysqld} ${args.join(' ')}`);
const child = spawn(mysqld, args, { stdio: 'inherit' });
child.on('error', (e) => {
  console.error('[mock-db] mysqld 실행 실패 — MYSQL_HOME 을 확인하세요', e.message);
  process.exit(1);
});
child.on('exit', (code) => process.exit(code ?? 0));
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => child.kill(sig));
