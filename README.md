# 키핑(Keeping) 사용자 API

취미활동 커뮤니티 **키핑**(2022-11 **하비셔스(Hobbious)**로 리브랜딩)의 사용자용 REST API 서버입니다.
피드(사진·태그·주제·좋아요·북마크·댓글/대댓글·언급), 매거진(한/영 본문·조회수·태그), 팔로우, 회원, 파일(S3) API 124개를 제공합니다.
지금은 운영하지 않는 서비스이며, 이 저장소는 포트폴리오 열람용 공개본입니다.

## 내 역할

- 저장소 생성 3주 뒤(2022-02-14)부터 **피드·매거진·파일 도메인을 처음부터 담당**했습니다. 인증·가입·회원·관리자·설정·배포는 다른 팀원이 작성했습니다.
- 주로 만든 것
  - 피드 조회(상세·팔로우 피드·북마크 피드·상세 하단 목록), 초안 우선 작성(pending → posting)과 재작성 정리
  - 댓글·대댓글·언급·댓글 좋아요
  - 목록 정합성: 첫 요청 시각(`pageDate`) 고정 페이지네이션, 페이지 단위 좋아요·북마크 상태 일괄 조회
  - S3 업로드·삭제 파이프라인과 용도별(피드·프로필·배경·매거진) 분기 저장
  - 공백을 무시하는 태그·주제 검색과 사용 수 집계
  - 매거진 모듈 전체(조회수 중복 방지, 한/영 본문 분리), 주제(topic) 모듈
  - 탈퇴 신청/취소, 검색기록, 하비셔스 메일 템플릿
- git 기준 비중: 백엔드 피드·매거진 도메인 약 70% / 전체 약 45%(생존 코드 기준), 커밋 59/122(48.4%, 2026년 추가분 제외).
  - 커밋한 사람 기준의 근사치입니다. 당시 파일을 메일로 주고받거나 git 밖에서 합친 커밋이 있어 실제 작성자와 다를 수 있습니다.
  - 초기 14커밋(2022-02-14 – 2022-03-10)은 회사 공용 계정으로 기록돼 있었고, 이 공개본에서 본인 계정으로 바꿨습니다.

## 기간

- 저장소: 2022-01-24 – 2022-11-04 (커밋 122개)
- 본인 커밋: 2022-02-14 – 2022-11-04 (2022-06-30 이후는 11-04의 1건). 모두 ChatGPT 공개(2022-11-30) 이전입니다.

## 스택

| 구분 | 내용 |
|---|---|
| 프레임워크 | NestJS 8, TypeScript 4 |
| ORM·DB | TypeORM 0.2(`@EntityRepository`), MySQL(Aurora), nestjs-typeorm-paginate |
| API 문서 | `@nestjs/swagger` 5 (`/api-docs`) |
| 인증 | JWT 발급(`@nestjs/jwt`), firebase-admin custom token, 카카오·네이버·구글 로그인 |
| 외부 서비스 | AWS S3·SES(aws-sdk v2), EJS 메일 템플릿 |
| 배포 | Serverless Framework + AWS Lambda(`@vendia/serverless-express`, `nodejs14.x`) |
| 실행 환경 | Node 14.21.3 · npm 6 (`.nvmrc`), 목업 DB는 MySQL 8.0.31 |

## 목업 모드로 실행하기

AWS·Firebase·카카오·네이버 없이 로컬 MySQL 하나로 띄울 수 있습니다. 자세한 내용은 [MOCK.md](MOCK.md)에 있습니다.

```bash
# Node 14.21.3 (.nvmrc), MySQL 8.0.31 폴더를 MYSQL_HOME 으로 지정
npm ci
npm run mock:db         # 터미널 1: MySQL 127.0.0.1:3307
npm run mock:db:seed    # 터미널 2: 스키마 + fixture
npm run start:mock      # 터미널 2: http://localhost:3000/api-docs
```

- 데모 로그인: `demo@example.com` / `keeping1234`. fixture는 모두 지어낸 데이터입니다.
- 목업 코드는 `src/_mock/`에만 있고 원본 소스는 고치지 않았습니다. 플래그 없이 빌드하면 원본 경로 그대로입니다.

## 알려진 한계 (당시 코드 그대로)

- **인증 없는 API — 사용자 식별을 클라이언트 입력에 맡김** (프로젝트 공통): 토큰을 발급하지만 검증하는 가드가 없고, `userId`를 쿼리·바디로 받습니다.
- 테스트가 없고(spec 0개), 목록마다 피드별 카운트 쿼리(N+1)가 남아 있습니다.

## 이 공개본에서 바꾼 것

공개를 위해 git 히스토리 전체를 정리했습니다. 커밋 순서·날짜·메시지와 코드는 당시 그대로입니다.

- 키 파일 `config/.env.development`, `config/.env.production`, `src/serviceAccountKey.json`을 히스토리에서 지웠습니다. 더미 `config/.env.example`·`src/serviceAccountKey.example.json`이 대신합니다.
- 소스에 하드코딩돼 있던 값을 `REDACTED_*` 자리표시자로 바꿨습니다.
  - `src/configs/typeorm.config.ts`(과거 `config/*.yaml` 포함): RDS 접속 정보
  - `src/auth/auth.module.ts`·`jwt.strategy.ts`: JWT secret
  - `serverless.yaml`: VPC 보안그룹·서브넷 ID
  - 과거 버전 `src/main.ts`의 AWS 액세스 키
  - 그래서 플래그 없는 원본 빌드는 되지만 실제 서버에는 연결되지 않습니다. 운영 자격증명은 폐기됐습니다.
- 메일 템플릿(`src/services/email/`)과 발신 주소의 회사 정보(대표 이름, 사업자등록번호, 주소, 이메일)를 `***`로 가렸습니다. 과거 코드에 있던 개인 이메일 1건도 같습니다. 상호명과 서비스 도메인은 남겼습니다.
- 작성자 표기
  - 회사 공용 계정으로 남긴 본인 커밋 14건은 본인 계정으로 바꿨습니다.
  - 다른 팀원은 이름만 남기고 이메일을 지웠습니다.
- 마지막 `chore(mock):` 커밋 5건과 이 README는 2026년에 포트폴리오용으로 추가했습니다.
- MOCK.md가 인용하는 원본 마지막 커밋 `d770b93`은 이 저장소의 `ad9948b`입니다. 브랜치 `portfolio/mock`은 `main`입니다.

## 라이선스

All rights reserved — 포트폴리오 열람용입니다. 코드의 복제·재사용·재배포를 허용하지 않습니다.
