import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import * as config from 'config';

@ApiTags('루트')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getIndex(): string {
    const html = `
      <html>
       <head>
        <title>Keeping User API Index</title>       
        </head>
        <body>
          <h1>키핑 사용자 API Index</h1>
          <p>현재 Staging : </p>
        </body>
      </html>
    `;

    return html;
  }
}
