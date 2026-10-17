import fs from 'fs';
import path from 'path';

// 목업 모드의 설정값은 config/.env.example(더미)에서 온다. main.mock.ts 가 AppModule 보다 먼저 import 한다.
// AppModule 의 ConfigModule 은 config/.env.development 를 읽지만 process.env 에 이미 있는 키는 덮지 않고
// (@nestjs/config config.module.js:177), ConfigService.get 은 process.env 를 먼저 본다(config.service.js:47-49).
// → 작업 트리에 실제 값이 든 .env.development 가 있어도 목업 모드에서는 쓰이지 않는다. 셸에서 준 환경변수는 그대로 우선한다.
const file = path.join(process.cwd(), 'config', '.env.example');
for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*?)\s*$/);
  if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
}
