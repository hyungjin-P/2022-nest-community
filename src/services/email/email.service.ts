import { Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';
import fs from 'fs';
import ejs from 'ejs';

@Injectable()
export class EmailService {
  public async sendVerificationCodeMail(
    lang: string,
    to: string,
    code: string,
  ): Promise<any> {
    AWS.config.update({ region: 'ap-northeast-2' });
    const SES = new AWS.SES({ apiVersion: '2010-12-01' });

    const viewPath = `src/services/ejs/${lang}_verification_code.ejs`;
    const view = fs.readFileSync(viewPath, 'utf-8');
    const html = ejs.render(view, { to: to, code: code + '' });

    let subjectData = '';
    if (lang == 'ko') {
      subjectData = `[${process.env['APP_NAME']}] 인증번호`;
    } else {
      subjectData = `[${process.env['APP_NAME']}] Verification Code`;
    }

    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: html,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subjectData,
        },
      },
      Source: `KEEPING <***@***.***>`,
    };

    return await SES.sendEmail(params).promise();
  }
}
