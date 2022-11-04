import { Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';
import fs from 'fs';
import ejs from 'ejs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  public async sendVerificationCodeMail(
    language: string,
    emailAddress: string,
    code: number,
  ): Promise<any> {
    AWS.config.update({
      accessKeyId: this.configService.get('AWS_SES_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SES_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_SES_REGION'),
    });
    const SES = new AWS.SES({ apiVersion: '2010-12-01' });

    const stagePath = this.configService.get('AWS_SES_FILEPATH');
    const viewPath = `${stagePath}/services/email/hobbiousEjs/${language}_verification_code.ejs`;
    const view = fs.readFileSync(viewPath, 'utf-8');
    const html = ejs.render(view, { to: emailAddress, code: code + '' });

    let subjectData = '';
    if (language === 'ko') {
      subjectData = `[Hobbious] 인증번호`;
    } else {
      subjectData = `[Hobbious] Verification Code`;
    }

    const params = {
      Destination: {
        ToAddresses: [emailAddress],
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
      Source: `Hobbious <***@***.***>`,
    };

    return await SES.sendEmail(params).promise();
  }

  public async sendResetPasswordLinkMail(
    language: string,
    emailAddress: string,
    token: string,
  ): Promise<any> {
    AWS.config.update({
      accessKeyId: this.configService.get('AWS_SES_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SES_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_SES_REGION'),
    });

    const SES = new AWS.SES({ apiVersion: '2010-12-01' });

    const stagePath = this.configService.get('AWS_SES_FILEPATH');
    const viewPath = `${stagePath}/services/email/hobbiousEjs/${language}_reset_password_link.ejs`;
    const view = fs.readFileSync(viewPath, 'utf-8');
    // const link = `${this.configService.get(
    //   'DOMAIN_WEB_ADDRESS',
    // )}/auth/reset-password/${token}`;
    const link = `https://hobbious.life/auth/reset-password/${token}`;
    const html = ejs.render(view, { to: emailAddress, link });

    let subjectData = '';

    if (language === 'ko') {
      subjectData = 'Hobbious 비밀번호 재설정';
    } else {
      subjectData = 'Hobbious Reset Password';
    }

    const params = {
      Destination: {
        ToAddresses: [emailAddress],
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
      Source: `Hobbious <***@***.***>`,
    };

    return await SES.sendEmail(params).promise();
  }
}
