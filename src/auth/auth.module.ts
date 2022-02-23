import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { FirebaseService } from '../services/firebase/firebase.service';
import { UserPictureRepository } from '../user/user-picture/user-picture.repository';
import { UserBackgroundRepository } from '../user/user-background/user-background.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'REDACTED_JWT_SECRET',
      signOptions: {
        expiresIn: 600,
      },
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      UserPictureRepository,
      UserBackgroundRepository,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FirebaseService],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
