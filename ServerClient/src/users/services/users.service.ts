import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly customerRepository: Repository<User>,
  ) {}

  createUser(createUserDto: Partial<User>): Promise<User> {
    const newUser = this.customerRepository.create(createUserDto);
    return this.customerRepository.save(newUser);
  }

  findUsersById(id: number) {
    return this.customerRepository.findOneBy({ id });
  }

  async findBy(query: Partial<User>): Promise<User[]> {
    return this.customerRepository.find({ where: query });
  }

  getUsers() {
    return this.customerRepository.find();
  }
}
