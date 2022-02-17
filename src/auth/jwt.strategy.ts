import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: 'REDACTED_JWT_SECRET',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload) {
    const { providedId } = payload;
    const user: User = await this.userRepository.findOne({
      where: { providedId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
