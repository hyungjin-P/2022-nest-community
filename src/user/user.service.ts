import { HttpException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonUtil } from '../utiles/common.util';
import { UserRegistrationDto } from './dto/user.registration.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private commonUtil: CommonUtil,
  ) {}

  /**
   * 모든 유저 조회
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * 유저 1건 조회
   * @param id (key)
   */
  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  /**
   * 유저 정보 수정
   * @param user
   */
  async modify(user: User): Promise<User> {
    if (!user.id) {
      throw new Error();
    }
    return await this.userRepository.save(user);
  }

  /**
   * 유저 생성
   * @param user
   */
  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  /**
   * 유저 레코드 1건 삭제
   * @param id (key)
   */
  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  /**
   * 이메일 중복 확인
   * @param providedId
   * */
  async hasProvidedIdAndDeleteAtIsNull(providedId: string): Promise<boolean> {
    return await this.userRepository.hasProvidedIdAndDeleteAtIsNull(providedId);
  }

  /**
   * 이메일로 회원 목록 조회
   * @param providedId
   * @param emailVerificationCode
   */
  async findAllByProvidedId(
    providedId: string,
    emailVerificationCode: number,
  ): Promise<User[]> {
    return await this.userRepository.findAllByProvidedIdAndDeleteAtIsNUll(
      providedId,
      emailVerificationCode,
    );
  }

  /**
   * 이메일 회원가입
   * @param userRegistrationDto
   * */
  async registration(userRegistrationDto: UserRegistrationDto): Promise<User> {
    const isSigned = await this.userRepository.hasProvidedIdAndDeleteAtIsNull(
      userRegistrationDto.email,
    );

    if (isSigned) {
      throw new HttpException(
        { code: 'failure', message: '이미 등록된 메일 입니다.' },
        500,
      );
    }

    return await this.userRepository.registrationUser(userRegistrationDto);
  }

  async getUserPage(options: IPaginationOptions): Promise<Pagination<User>> {
    const queryBuilder = await this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.created_at', 'DESC');

    return paginate<User>(queryBuilder, options);
  }
}
