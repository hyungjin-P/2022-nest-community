import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

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
          <h1>Keeping User API Index</h1>
        </body>
      </html>
    `;

    return html;
  }
}
