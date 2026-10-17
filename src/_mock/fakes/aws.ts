import AWS from 'aws-sdk';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// 원본은 메서드 안에서 new AWS.S3()·new AWS.SES() 를 만든다(file.service.ts:37, email.service.ts:21).
// 모듈 객체의 S3·SES 를 바꿔 두면 원본 로직(검증·키 생성·DB 저장·분기)은 그대로 돌고 저장·발송만 로컬로 간다.

const MOCK_DIR = path.join(process.cwd(), '.mock');
const UPLOADS = path.join(MOCK_DIR, 'uploads');
const OUTBOX = path.join(MOCK_DIR, 'outbox');

interface S3Params {
  Bucket: string;
  Key: string;
  Body?: Buffer;
}

const uploadPath = (p: S3Params) => path.join(UPLOADS, p.Bucket, ...p.Key.split('/'));

class FakeS3 {
  upload(params: S3Params) {
    return {
      promise: async () => {
        const file = uploadPath(params);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, params.Body ?? Buffer.alloc(0));
        const etag = crypto.createHash('md5').update(params.Body ?? '').digest('hex');
        return {
          Bucket: params.Bucket,
          Key: params.Key,
          Location: `http://localhost:${process.env.SERVER_PORT}/_mock/uploads/${params.Bucket}/${params.Key}`,
          ETag: `"${etag}"`,
        };
      },
    };
  }

  deleteObject(params: S3Params) {
    return {
      promise: async () => {
        fs.rmSync(uploadPath(params), { force: true });
        return {};
      },
    };
  }
}

interface SesParams {
  Destination: { ToAddresses: string[] };
  Message: { Body: { Html: { Data: string } }; Subject: { Data: string } };
}

class FakeSES {
  sendEmail(params: SesParams) {
    return {
      promise: async () => {
        fs.mkdirSync(OUTBOX, { recursive: true });
        const to = params.Destination.ToAddresses.join(',');
        const file = path.join(OUTBOX, `${Date.now()}-${to.replace(/[^\w.@-]/g, '_')}.html`);
        fs.writeFileSync(file, params.Message.Body.Html.Data);
        console.log(`[mock-ses] "${params.Message.Subject.Data}" → ${to} (${path.relative(process.cwd(), file)})`);
        return { MessageId: `mock-${path.basename(file, '.html')}` };
      },
    };
  }
}

export function installFakeAws(): void {
  const sdk = AWS as unknown as Record<string, unknown>;
  sdk.S3 = FakeS3;
  sdk.SES = FakeSES;
}

export const MOCK_UPLOADS_DIR = UPLOADS;
