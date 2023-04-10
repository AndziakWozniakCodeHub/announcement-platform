import {
  Controller,
  Get,
  Logger,
  ParseIntPipe,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import {
  delay,
  endWith,
  of,
  Subject,
  take,
  takeUntil,
  tap,
  combineLatest,
} from 'rxjs';
import { AppService } from './app.service';
import { Request } from 'express';
import { OnCloseInterceptor } from './interceptors/on-close.interceptor';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  private logger = new Logger('MICROSERVICE');
  constructor(private readonly appService: AppService) {}

  microservice(
    @Query('delay', ParseIntPipe) delayTime: number,
    @Req() request: Request,
  ) {
    const close$ = new Subject();

    request.on('close', () => {
      this.logger.error('ON CLOSE');
      close$.next(true);
    });

    this.logger.warn('START');

    return of(`RESPONSE FROM ${delayTime}`).pipe(
      delay(delayTime * 1000),
      takeUntil(close$),
      tap({
        next: () => this.logger.debug('NEXT'),
        finalize: () => this.logger.debug('FINALIZE'),
      }),
      endWith(''),
      take(1),
    );
  }

  @UseInterceptors(OnCloseInterceptor)
  data() {
    const req5$ = this.appService.request(
      'http://localhost:3000/microservice?delay=5',
    );
    const req3$ = this.appService.request(
      'http://localhost:3000/microservice?delay=3',
    );
    const req1$ = this.appService.request(
      'http://localhost:3000/microservice?delay=1',
    );

    const data$ = combineLatest([req5$, req3$, req1$]).pipe(
      tap({
        next: () => console.log('DATA NEXT'),
        finalize: () => console.log('DATA FINALIZE'),
      }),
    );

    return data$;
  }
}
