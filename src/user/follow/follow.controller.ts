import { Controller, Get } from '@nestjs/common';

@Controller('follow')
export class FollowController {
  @Get('/push')
  async pushFollow(): Promise<void> {}

  @Get('/pop')
  async popFollow(): Promise<void> {}
}
