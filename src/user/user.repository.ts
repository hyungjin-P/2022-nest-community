import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from '../auth/dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from '@nestjs/common';
import { getRepository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(userCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password } = userCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ email, password: hashedPassword });

    try {
      await this.save(user);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async hasProvidedIdAndDeleteAtIsNull(providedId: string): Promise<boolean> {
    const users: User[] = await getRepository(User)
      .createQueryBuilder('user')
      .where(
        'user.provided_id = :providedId and deleted_at is null and email_verified = 1',
        {
          providedId,
        },
      )
      .getMany();
    return users.length > 0;
  }

  async findAllByProvidedIdAndDeleteAtIsNUll(
    providedId: string,
  ): Promise<User[]> {
    return await getRepository(User)
      .createQueryBuilder('user')
      .where('user.provided_id = :providedId and deleted_at is null', {
        providedId,
      })
      .getMany();
  }
}
