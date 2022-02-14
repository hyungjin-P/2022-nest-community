import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CommonUtil } from '../utiles/common.util';
import { EmailService } from '../services/email/email.service';
import moment from 'moment-timezone';
import { ResponseData } from '../response.data';

@ApiTags('사용자 정보')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private commonUtil: CommonUtil,
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
  async findById(
    @Query('id') id: string): Promise<User> {
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

  @Get('/hasProvidedIdAndDeleteAtIsNull')
  @ApiOperation({
    summary: '이메일 중복 확인',
    description: '이메일 중복 확인',
  })
  @ApiCreatedResponse({
    description: '회원가입시 등록된 이메일이 존재하는지 확인한다.',
    type: User,
  })
  async hasProvidedIdAndDeleteAtIsNull(
    @Query('providedId') providedId: string,
  ): Promise<ResponseData> {
    const result = await this.userService.hasProvidedIdAndDeleteAtIsNull(
      providedId,
    );
    return new ResponseData('success', '200', result);
  }

  @Get('/sendVerifiedCodeMail')
  @ApiOperation({
    summary: '회원가입 이메일 인증 코드 보내기',
    description: '회원가입 이메일 인증 코드 보내기',
  })
  @ApiCreatedResponse({
    description: '이메일로 회원가입 인증 코드를 보낸다',
  })
  async sendVerificationCodeMail(
    @Query('emailAddress') emailAddress: string,
    @Query('language') language: string,
  ): Promise<any> {
    // 이메일 중복 확인
    if (await this.userService.hasProvidedIdAndDeleteAtIsNull(emailAddress)) {
      throw new HttpException(
        { code: 'failure', message: '이미 등록된 이메일이 존재합니다.' },
        200,
      );
    }

    // 인증코드 생성
    const code: number = this.commonUtil.getRandomInt(100000, 1000000);
    const codeExpressIn = moment()
      .add(3, 'minutes')
      .format('YYYY-MM-DD HH:mm:ss');

    console.log('----------------------');
    console.log('codeExpressIn: ', codeExpressIn);
    console.log('codeExpressIn to date', new Date(codeExpressIn));
    console.log('----------------------');

    // 신규 유저 임시 생성
    const user: User = new User();
    user.provider = 'keeping.link';
    user.providedId = emailAddress;
    user.email = emailAddress;
    user.emailVerificationCode = code;
    user.emailVerificationCodeExpiresin = new Date(codeExpressIn);
    user.color = this.commonUtil.randomColor();

    const createdUser = await this.userService.create(user);
    console.log('createdUser : ', createdUser);
    console.log('user : ', user);

    return await this.emailService.sendVerificationCodeMail(
      language,
      emailAddress,
      code,
    );
  }

  @Get('/checkVerificationCode')
  @ApiOperation({
    summary: '회원가입 인증 코드 확인',
    description: '회원가입 인증 코드 확인',
  })
  @ApiCreatedResponse({
    description: '회원가입시 발송한 이메일 인증번호를 확인한다.',
  })
  async checkVerificationCode(
    @Query('providedId') providedId: string,
    @Query('verifiedCode') verifiedCode: number,
  ): Promise<void> {
    const users: User[] = await this.userService.findAllByProvidedId(
      providedId,
    );

    console.log('providedId : ', providedId);
    console.log('verifiedCode : ', verifiedCode);
    console.log('users : ', users);

    if (users.length === 0) {
      throw new HttpException(
        { code: 'failure', message: '이메일 인증이 필요합니다.' },
        200,
      );
    }

    if (users[0].emailVerified) {
      throw new HttpException(
        { code: 'failure', message: '이미 가입된 이메일이 존재합니다.' },
        200,
      );
    }

    if (users[0].emailVerificationCode !== verifiedCode) {
      throw new HttpException(
        { code: 'failure', message: '인증코드가 일치하지 않습니다.' },
        200,
      );
    }

    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const expiressIn = moment(users[0].emailVerificationCodeExpiresin).format(
      'YYYY-MM-DD HH:mm:ss',
    );
    const diff = moment(expiressIn).diff(now, 'seconds');

    if (diff < 0) {
      throw new HttpException('만료된 인증번호 입니다.', 200);
    }
  }

  @Post('/registration')
  @ApiOperation({
    summary: '이메일 회원가입',
    description: '이메일 회원가입',
  })
  @ApiCreatedResponse({
    description: '이메일로 회원가입 한다.',
    type: User,
  })
  async signIn(@Body() user: User): Promise<void> {
    console.log('-------------------------');
    console.log('/registration user : ', user);
    console.log('-------------------------');
  }
}
