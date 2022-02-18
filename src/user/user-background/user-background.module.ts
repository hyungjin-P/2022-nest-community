import { Module } from '@nestjs/common';
import { UserBackgroundController } from './user-background.controller';
import { UserBackgroundService } from './user-background.service';

@Module({
  controllers: [UserBackgroundController],
  providers: [UserBackgroundService]
})
export class UserBackgroundModule {}
