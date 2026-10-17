# 목업 모드 실행 안내 (`portfolio/mock`)

키핑(2022-11 하비셔스로 리브랜딩) 사용자 API(NestJS 8)를 **AWS·Firebase·카카오·네이버 없이** 로컬에서 띄우기 위한 목업 층입니다.
원본 소스는 고치지 않았습니다. 목업 코드는 모두 `src/_mock/`에 있고 `MOCK=1`(= `npm run start:mock`)로 켭니다.
플래그 없이 빌드하면 원본 경로가 그대로이며, 원본 산출물 해시가 목업 층 추가 전과 같습니다.

## 1. 요구 환경

| 항목 | 버전 | 비고 |
|---|---|---|
| Node.js | **14.21.3** (`.nvmrc`) | `serverless.yaml`의 `runtime: nodejs14.x` |
| npm | 6.14.18 | Node 14.21.3에 포함. lockfile v1 |
| MySQL | **8.0.31** (Windows noinstall zip 등) | 원본 쿼리가 MySQL 전용 `REGEXP`를 쓴다(아래 4절). Windows는 VC++ 2015-2022 런타임 필요 |

```bash
nvm install 14.21.3 && nvm use 14.21.3          # nvm-windows / nvm
volta install node@14.21.3                     # volta
# 또는 https://nodejs.org/dist/v14.21.3/ 포터블 zip 을 받아 PATH 앞에 둔다

# MySQL: https://cdn.mysql.com/archives/mysql-8.0/mysql-8.0.31-winx64.zip 을 풀고 그 폴더를 MYSQL_HOME 으로 지정
export MYSQL_HOME=/path/to/mysql-8.0.31-winx64      # PowerShell: $env:MYSQL_HOME = 'D:\...\mysql-8.0.31-winx64'
```

설정 파일은 복사하지 않아도 됩니다. 목업 모드는 `config/.env.example`(더미 값)을 직접 읽고, 셸 환경변수가 있으면 그것이 우선합니다.

## 2. 설치·기동

```bash
npm ci                     # lockfile 그대로 설치
npm run mock:db            # 터미널 1: MySQL(127.0.0.1:3307). 첫 실행 때 .mock/mysql-data 를 초기화한다
npm run mock:db:seed       # 터미널 2: keeping_mock DB 를 지우고 스키마 + fixture 를 넣는다(언제든 다시 실행 가능)
npm run start:mock         # 터미널 2: = cross-env MOCK=1 nest start -p src/_mock/tsconfig.mock.json --entryFile _mock/main.mock
```

| 주소 | 내용 |
|---|---|
| `http://localhost:3000/api-docs` | Swagger UI (엔드포인트 124개) |
| `http://localhost:3000/` | 원본 루트 페이지(STAGE 표시 → `mock`) |
| `http://localhost:3000/_mock/egress` | 목업이 막은 외부 연결 기록(정상이면 `[]`, Swagger 문서에서는 제외) |

로그인 없이도 모든 API를 부를 수 있습니다. 원본이 토큰을 검증하지 않고 `userId` 쿼리·바디로 사용자를 구분하기 때문입니다.
데모 사용자 id는 `10000000-0000-4000-8000-000000000001`이고, 그 밖의 fixture id 규칙은 `src/_mock/db/fixtures.js` 맨 위에 있습니다.

| 로그인 API | 목업 입력 | 결과 |
|---|---|---|
| `POST /auth/signIn` | `{"providedId":"demo@example.com","password":"keeping1234"}` | 데모 사용자 + accessToken·refreshToken·Firebase custom token(가짜) |
| 〃 | `withdrawal@example.com` / `keeping1234` | 탈퇴 유예 회원 → `500 {code:'failure:deleted'}` |
| `POST /auth/kakao` | `{"accessToken":"mock-kakao-existing"}` / `"mock-kakao-new"` | 기존 카카오 회원 로그인 / 신규 가입 |
| `POST /auth/signInNaver` | `{"code":"mock-naver"}` | 네이버 신규 가입(두 번째부터 로그인) |
| `POST /auth/firebaseSignIn` | `{"accessToken":"mock-google"}` | 구글 신규 가입(두 번째부터 로그인) |

목록 API는 원본 설계대로 첫 요청 시각 `pageDate`(ISO 문자열)를 넘겨야 결과가 나옵니다. 매거진 목록은 `category=all`도 필요합니다.

## 3. 원본 대비 변경 목록

`git diff d770b93..portfolio/mock`

| 파일 | 변경 |
|---|---|
| `src/_mock/**` | **추가** — 목업 층 전부(아래 4절) |
| `package.json` | 스크립트 `start:mock`·`mock:db`·`mock:db:seed` **추가**(의존성 무변경) |
| `package-lock.json` | **추가** — 원본 lock 이 git 에 없어(`.gitignore`) Node 14·npm 6에서 `npm install --before=2022-11-05`로 다시 만들었다. `@nestjs/typeorm`만 8.1.4(typeorm 0.3 전용)가 풀려, 선언 범위 `^8.0.3` 안에서 typeorm 0.2 를 지원하는 마지막 버전 8.0.4로 고정 |
| `.nvmrc` | **추가** — `14.21.3` |
| `config/.env.example`, `src/serviceAccountKey.example.json` | **추가** — 더미 값 |
| `config/.env.development`, `config/.env.production`, `src/serviceAccountKey.json` | git 추적 해제(비밀 파일) |
| `.gitignore` | 위 비밀 파일, `/.mock/`, `/dist-mock` 추가. `/package-lock.json` 제거 |
| 원본 소스(`src/main.ts`, `src/lambda.ts`, `src/app.module.ts` 등) | **변경 없음** |

버전 업그레이드와 의존성 교체는 **없습니다**.

## 4. 목업으로 대체한 기능

| 원본 의존 | 목업 처리 | 위치 |
|---|---|---|
| 진입점 `main.ts`(Firebase 키 json 정적 import + `initializeApp`) | `main.mock.ts`로 기동. 키 파일을 읽지 않는다. 목업 빌드는 `main.ts`·`lambda.ts`를 컴파일 대상에서 뺀다 | `main.mock.ts`, `tsconfig.mock.json` |
| Aurora MySQL(접속 정보 하드코딩 `configs/typeorm.config.ts`) | 로컬 MySQL 8.0. `AppModule` 구성을 그대로 쓰고 TypeORM 루트 연결만 원본에 있던 env 기반 `TypeOrmConfigService`로 바꾼다 | `mock-app.module.ts`, `db/` |
| 설정(`config/.env.development`) | `config/.env.example`의 더미 값을 먼저 `process.env`에 넣는다 → 실제 값이 든 파일이 있어도 쓰이지 않는다 | `mock-env.ts` |
| AWS S3 (`new AWS.S3()`) | `FakeS3` — `.mock/uploads/<버킷>/<키>`에 저장·삭제. 원본의 검증·uuid 키·DB 저장·태그 분기는 그대로 돈다. DB에 남는 `url`은 원본 코드대로 `https://<버킷 도메인>/<키>`이고, 파일은 `/_mock/uploads/<버킷>/<키>`로 볼 수 있다 | `fakes/aws.ts` |
| AWS SES (`new AWS.SES()`) | `FakeSES` — 원본 ejs 템플릿으로 렌더한 메일을 `.mock/outbox/*.html`에 쓰고 콘솔에 경로를 찍는다(인증번호 확인용) | `fakes/aws.ts` |
| Firebase Admin `auth()` | custom token은 `mock-firebase-custom-token.<userId>`, ID token 검증은 `mock-google`만 통과 | `fakes/firebase.ts` |
| 카카오·네이버 OpenAPI (`@nestjs/axios`) | AuthModule 의 axios 인스턴스에 adapter를 붙여 fixture로 응답. 목록에 없는 요청은 보내지 않고 실패 | `fakes/social-api.ts` |
| 그 밖의 외부 연결 | `net.Socket.connect`에서 loopback 외 연결을 막고 `/_mock/egress`에 기록(DNS 조회 전에 막힌다) | `egress-guard.ts` |
| Lambda·API Gateway | 해당 없음. 로컬 HTTP 서버로 기동 | — |

### DB 스키마 (역산)

원본 저장소에는 DDL이 없습니다(`synchronize: false`). `src/_mock/db/schema.sql`은 엔티티 메타데이터에서 만들었고(테이블 36·FK 22), 아래는 코드 근거로 보정했습니다. 자세한 내용은 파일 머리 주석에 있습니다.

- `@OneToOne`으로 선언됐지만 실제로는 N:1인 관계(작성자·좋아요 사용자·언급 대상·주제) → TypeORM이 만드는 unique index를 뺐다(7개 테이블). 매거진 한/영 본문은 실제 1:1이라 유지
- PK 외 컬럼은 NULL 허용 — 엔티티의 NOT NULL이 실제 DB와 다르다(`user.entity.ts:103` 주석, `magazine.repository.ts:75`)
- `feed.state`·`magazine.state` 기본값 `'..._pending'` — 원본이 `{ userId }`만 저장한 뒤 pending 초안을 다시 찾는다
- `type: 'timestamp'` 3개 컬럼의 정밀도를 MySQL이 받는 형태로 맞춤

MySQL 서버 옵션(`db/start.js`): `mysql_native_password`(mysql 2.18 드라이버 제약), `default-time-zone=+00:00`(원본 `timezone: 'Z'`), `sql-mode=NO_ENGINE_SUBSTITUTION`(원본 `GROUP BY` 쿼리가 `ONLY_FULL_GROUP_BY`에서 실패 — RDS 기본값으로 가정).

### fixture

전부 지어낸 가짜 데이터입니다. 이메일은 예약 도메인 `example.com`만 씁니다.
- 회원 10명(일반 8, 카카오 가입 1, 탈퇴 유예 1), 피드 16개 + 데모 사용자의 등록 전 초안 1개, 댓글·대댓글·언급, 매거진 6개(한/영 본문), 주제 6개, 팔로우·좋아요·북마크
- 시각은 seed 시점 기준 상대값입니다
- 이미지는 keeping-angular 목업과 같은 SVG 일러스트(손으로 만든 도형 그림) 32장: `src/_mock/assets/img/`

## 5. 원본 경로(플래그 off)

```bash
cp src/serviceAccountKey.example.json src/serviceAccountKey.json   # 빌드용 더미(원본 main.ts·lambda.ts 가 정적 import)
npm run build                                                      # 원본 그대로의 nest build → dist/
```

실행(`npm run start`)에는 실제 DB·Firebase·AWS 자격증명이 필요합니다. 운영 자격증명은 폐기됐습니다.

## 6. 알려진 제약

- 소셜 로그인은 위 목업 토큰만 통과합니다. 카카오 연동 해제(`/auth/signOutKakao`)도 같은 토큰을 씁니다.
- 메일 템플릿 안의 이미지·링크는 원본 그대로 `public.keeping.link`·`hobbious.life`를 가리킵니다(파일로만 저장하고 보내지 않음).
- `mysql` 드라이버 기본 문자셋이 `utf8`(3바이트)이라 이모지 같은 4바이트 문자는 저장되지 않습니다(원본 연결 설정 그대로).
- 원본의 JWT 서명 secret(`auth.module.ts`)과 검증 secret(`JWT_ACCESS_SECRET`)이 다르지만, JWT 가드를 쓰는 라우트가 없어 동작에는 영향이 없습니다.
- 쓰기 동작(가입·좋아요·업로드 등)은 DB에 남습니다. `npm run mock:db:seed`로 초기 상태로 돌립니다.
