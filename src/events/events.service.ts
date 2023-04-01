import { Injectable } from '@nestjs/common';
import { log } from 'console';

@Injectable()
export class EventsService {
  public printEnv(): void {
    log(process.env.DB_NAME);
  }
}
