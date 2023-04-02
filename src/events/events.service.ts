import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  private getEventsBaseQuery() {
    return this.eventsRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  public async getEvent(id: number): Promise<Event> {
    const query = await this.getEventsBaseQuery().andWhere('e.id = :id', {
      id,
    });

    this.logger.debug(query.getSql()); //prints out the sql that would be generated to execute this query

    return query.getOne();
  }
}

// return await this.getEventsBaseQuery()
//       .andWhere('e.id = :id', { id }) //{id} tells andWhere what argument to bind
//       .getOne();
