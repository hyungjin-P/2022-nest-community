import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { User } from '../user/user.entity';
import { AdminUser } from './admin-user/admin-user.entity';
import { AdminSignInDto } from './dto/admin-signIn.dto';

@ApiTags('관리자')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/getUser')
  @ApiOperation({
    summary: '관리자 조회',
    description: '관리자 조회',
  })
  @ApiCreatedResponse({
    description: '관리자의 정보를 조회한다.',
  })
  async getTest(): Promise<User> {
    return await this.adminService.getUser();
  }

  @Post('/signIn')
  @ApiOperation({
    summary: '관리자 로그인',
    description: '관리자 로그인',
  })
  @ApiCreatedResponse({
    description: '관리자 사이트 로그인',
  })
  async signIn(@Body() adminSignInDto: AdminSignInDto): Promise<AdminUser> {
    const adminUser: AdminUser = await this.adminService.signIn(adminSignInDto);
    return adminUser;
  }
}
