import 'express';
import { RequestPayload } from './typeorm/customer.entity';

declare module 'express' {
  export interface Request {
    payload?: RequestPayload | undefined | null;
  }
}
