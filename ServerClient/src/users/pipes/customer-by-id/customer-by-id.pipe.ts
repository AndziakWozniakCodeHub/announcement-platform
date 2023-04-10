import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CustomersService } from '../../services/customers.service';

@Injectable()
export class CustomerByIdPipe implements PipeTransform {
  constructor(private usersService: CustomersService) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    const id = parseInt(value, 10);

    if (!id) {
      throw new BadRequestException(`Customer id is invalid`);
    }

    const user = await this.usersService.findUsersById(id);

    if (!user) {
      throw new NotFoundException(`Customer ${id} not found`);
    }

    return user;
  }
}
