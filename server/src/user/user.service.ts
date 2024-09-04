import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    const newUser = await this.userRepository.save(user);
    return newUser;
  }

  findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  findUserById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }
  findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({
      email,
    });
  }
}
