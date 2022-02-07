import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonUtil } from '../utiles/common.util';

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
  async findProvidedIdAndDeleteAtIsNull(providedId: string): Promise<boolean> {
    return await this.userRepository.findProvidedIdAndDeleteAtIsNull(
      providedId,
    );
  }

  /**
   * 이메일 회원가입
   * @param user
   * */
  async signIn(user: User): Promise<void> {
    const isSigned = await this.userRepository.findProvidedIdAndDeleteAtIsNull(
      user.providedId,
    );

    if (isSigned) {
      throw new Error('이미 회원가입한 회원입니다.');
    }

    // 유저 랜덤 색상
    user.color = this.commonUtil.randomColor();


  }
}
