import 'express';
import { RequestPayload } from './typeorm/user.entity';

declare module 'express' {
  export interface Request {
    payload?: RequestPayload | undefined | null;
  }
}
