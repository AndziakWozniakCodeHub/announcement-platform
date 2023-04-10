import { Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Contract } from 'src/typeorm/contract.entity';
import { EntityManager } from 'typeorm';
import { Customer } from '../../typeorm/customer.entity';
import { ContractByIdPipe } from '../pipes/contract-by-id/contract-by-id.pipe';
import { CustomerByIdPipe } from '../pipes/customer-by-id/customer-by-id.pipe';

@Controller('customers-contract-manager')
@ApiTags('CustomersContractManager')
export class CustomersContractController {
  constructor(private manager: EntityManager) {}

  @Post('contractManager/:customerId/:contractId')
  @ApiParam({ name: 'customerId', type: String })
  @ApiParam({ name: 'contractId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Contract has been assigned to Customer successfuly.',
    type: Customer,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
  })
  async addContract(
    @Param('customerId', CustomerByIdPipe) customer: Customer,
    @Param('contractId', ContractByIdPipe) contract: Contract,
  ) {
    if (
      !customer.contracts.find((c) => c.contract_id === contract.contract_id)
    ) {
      customer.contracts.push(contract);

      await this.manager.save(customer);
    }

    return { customer };
  }

  @Delete('contractManager/:customerId/:contractId')
  @ApiParam({ name: 'customerId', type: String })
  @ApiParam({ name: 'contractId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Contract has been removed from Customer successfully.',
    type: Customer,
  })
  async removeRole(
    @Param('customerId', CustomerByIdPipe) customer: Customer,
    @Param('contractId', ContractByIdPipe) contract: Contract,
  ) {
    customer.contracts = customer.contracts.filter(
      (c) => c.contract_id !== contract.contract_id,
    );

    await this.manager.save(customer);

    return { customer, contract };
  }
}
