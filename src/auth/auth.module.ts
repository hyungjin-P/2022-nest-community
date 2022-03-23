import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { FirebaseService } from '../services/firebase/firebase.service';
import { UserPictureRepository } from '../user/user-picture/user-picture.repository';
import { UserBackgroundRepository } from '../user/user-background/user-background.repository';
import { HttpModule } from '@nestjs/axios';
import { CommonUtil } from '../utiles/common.util';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'REDACTED_JWT_SECRET',
      signOptions: {
        expiresIn: 600 * 3,
      },
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      UserPictureRepository,
      UserBackgroundRepository,
    ]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    FirebaseService,
    CommonUtil,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
