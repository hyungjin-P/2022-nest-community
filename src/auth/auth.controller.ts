import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { UserEmailSignInDto } from './dto/user-email-sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signIn')
  @ApiOperation({
    summary: '이메일 로그인',
    description: '이메일 로그인',
  })
  @ApiCreatedResponse({
    description: '이메일로 로그인한다',
    type: User,
  })
  async signIn(@Body() userEmailSignInDto: UserEmailSignInDto): Promise<User> {
    const user: User = await this.authService.signIn(userEmailSignInDto);
    console.log('accessToken : ', user.accessToken);
    return user;
  }
}
