import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserEmailSignInDto } from './dto/user-email-sign-in.dto';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';
import { FirebaseService } from '../services/firebase/firebase.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private firebaseService: FirebaseService,
  ) {}

  /**
   * 이메일 로그인
   * @param userEmailSignInDto
   */
  async signIn(userEmailSignInDto: UserEmailSignInDto): Promise<User> {
    console.log('userEmailSignInDto : ', userEmailSignInDto);
    // 가입한 이메일 조회
    const user: User = await this.userRepository.findOne({
      where: {
        providedId: userEmailSignInDto.providedId,
        emailVerified: true,
      },
    });

    console.log('find user : ', user);

    if (!user) {
      throw new HttpException(
        {
          code: 'failure',
          message: '사용자가 존재하지 않습니다.',
        },
        500,
      );
    }

    if (!(await bcrypt.compare(userEmailSignInDto.password, user.password))) {
      throw new HttpException(
        {
          code: 'failure',
          message: '비밀번호가 일치하지 않습니다.',
        },
        500,
      );
    }

    const payload = { providedId: userEmailSignInDto.providedId };
    user.accessToken = this.jwtService.sign(payload);
    user.customToken = await this.firebaseService.createCustomToken(
      user.id,
      {},
    );

    return user;
  }
}
