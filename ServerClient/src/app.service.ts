import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {
  request(url: string): Observable<string> {
    return new Observable((subscriber) => {
      const controller = new AbortController();
      axios
        .get(url, {
          signal: controller.signal,
        })
        .then((res) => {
          subscriber.next(res.data);
          subscriber.complete();
        })
        .catch((error) => {
          subscriber.error(error);
        });

      return () => {
        console.log('DESTRUCT', url);
        controller.abort();
      };
    });
  }
}
