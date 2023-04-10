import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/typeorm/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  createUser(createCustomerDto: Partial<Customer>): Promise<Customer> {
    const newUser = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(newUser);
  }

  findUsersById(id: number) {
    return this.customerRepository.findOneBy({ id });
  }

  async findBy(query: Partial<Customer>): Promise<Customer[]> {
    return this.customerRepository.find({ where: query });
  }

  getUsers() {
    return this.customerRepository.find();
  }
}
