import { HttpException, Injectable } from '@nestjs/common';
import { AdminUserRepository } from './admin-user/admin-user.repository';
import { CodeAuthorityRepository } from './code-authority/code-authority.repository';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { AuthService } from '../auth/auth.service';
import { UserEmailSignInDto } from '../auth/dto/user-email-sign-in.dto';
import { AdminUser } from './admin-user/admin-user.entity';
import { CodeAuthority } from './code-authority/code-authority.entity';
import { AdminSignInDto } from './dto/admin-signIn.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly codeAuthorityRepository: CodeAuthorityRepository,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async getUser(): Promise<User> {
    const user: User = await this.userService.findById(
      '5f40cd14-19fb-4bf3-9b44-6c5721eea902',
    );

    return user;
  }

  async signIn(adminSignInDto: AdminSignInDto): Promise<AdminUser> {
    const userInfo: User = await this.authService.signIn({
      providedId: adminSignInDto.email,
      password: adminSignInDto.password,
    });

    const adminUser: AdminUser = await this.adminUserRepository.findOne({
      where: {
        userId: userInfo.id,
      },
    });

    if (!adminUser) {
      throw new HttpException(
        { code: 'failure', message: '관리자가 존재하지 않습니다.' },
        500,
      );
    }

    const authority: CodeAuthority = await this.codeAuthorityRepository.findOne(
      {
        where: {
          id: adminUser.codeAuthorityId,
        },
      },
    );

    adminUser.user = userInfo;
    adminUser.codeAuthority = authority;

    return adminUser;
  }
}
