import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap, map } from 'rxjs';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    console.time('TIMER');

    return next.handle().pipe(
      tap({
        finalize: () => console.timeEnd('TIMER'),
      }),
      map((res) => res),
    );
  }
}
