import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonUtil } from '../utiles/common.util';
import { EmailService } from '../services/email/email.service';

@ApiTags('사용자 정보')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private util: CommonUtil,
    private emailService: EmailService,
  ) {}

  @Get('/getAll')
  @ApiOperation({
    summary: '사용자 정보 전체 조회',
    description: '사용자 정보 전체 조회',
  })
  @ApiCreatedResponse({
    description: '사용자 정보를 전체조회 한다.',
    type: User,
  })
  async getAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get('/findById')
  @ApiOperation({
    summary: '사용자 id(key)로 조회',
    description: '사용자 id(key)로 조회',
  })
  @ApiCreatedResponse({
    description: '사용자를 id(key)로 1건 조회한다',
    type: User,
  })
  async findById(@Query('id') id: string): Promise<User> {
    return await this.userService.findById(id);
  }

  @Post('/modify')
  @ApiOperation({
    summary: '사용자 정보 수정',
    description: '사용자 정보 수정',
  })
  @ApiCreatedResponse({
    description: '사용자 정보를 수정한다.',
    type: User,
  })
  async modify(@Body() user: User): Promise<void> {
    await this.userService.modify(user);
  }

  @Delete('/delete')
  @ApiOperation({
    summary: '사용자 정보 삭제',
    description: '사용자 정보 삭제',
  })
  @ApiCreatedResponse({
    description: '사용자 정보를 삭제한다.',
    type: User,
  })
  async delete(@Query('id') id: string): Promise<void> {
    await this.userService.delete(id);
  }

  @Get('/findProvidedIdAndDeleteAtIsNull')
  @ApiOperation({
    summary: '이메일 중복 확인',
    description: '이메일 중복 확인',
  })
  @ApiCreatedResponse({
    description: '회원가입시 등록된 이메일이 존재하는지 확인한다.',
    type: User,
  })
  async findProvidedIdAndDeleteAtIsNull(
    @Query('providedId') providedId: string,
  ): Promise<boolean> {
    return await this.userService.findProvidedIdAndDeleteAtIsNull(providedId);
  }

  @Post('/signInEmail')
  @ApiOperation({
    summary: '이메일 회원가입',
    description: '이메일 회원가입',
  })
  @ApiCreatedResponse({
    description: '이메일로 회원가입 한다',
    type: User,
  })
  async signIn(@Body() user: User): Promise<void> {
    await this.userService.create(user);
  }

  @Get('/send/emailTest')
  async sendEmailTest(): Promise<any> {
    return await this.emailService.sendVerificationCodeMail(
      'ko',
      '***@***.***',
      '123456',
    );
  }
}
