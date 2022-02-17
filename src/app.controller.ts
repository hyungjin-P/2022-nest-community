import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('루트')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/')
  getIndex(): string {
    const html = `
      <html>
       <head>
        <title>Keeping User API Index</title>
        </head>
        <body>
          <h1>키핑 사용자 API Index</h1>
          <p>현재 STAGE : ${this.configService.get('NOW_STAGE')} </p>
        </body>
      </html>
    `;

    return html;
  }
}
