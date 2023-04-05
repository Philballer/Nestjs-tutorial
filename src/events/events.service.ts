import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';
import { AttendeeAnswerEnum } from 'src/attendee/attendee.entity';

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

  // prettier-ignore
  public getEventsWithAttendeeCountQuery() {
    return (
      this.getEventsBaseQuery()
        .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
        .loadRelationCountAndMap(
          'e.attendeeUnanswered', //invite status, always the property
          'e.attendees', // relation to dB
          'attendee', //the alias, could be anything like a each in array
          (qb) => qb.where(
            'attendee.answer = :answer',
            { answer: AttendeeAnswerEnum.Unanswered}
          )
        ) 
        .loadRelationCountAndMap(
          'e.attendeeAccepted', 
          'e.attendees', 
          'attendee', 
          (qb) => qb.where(
            'attendee.answer = :answer',
            { answer: AttendeeAnswerEnum.Accepted}
          )
        ) 
        .loadRelationCountAndMap(
          'e.attendeeRejected', 
          'e.attendees', 
          'attendee', 
          (qb) => qb.where(
            'attendee.answer = :answer',
            { answer: AttendeeAnswerEnum.Rejected}
          )
        ) 
        
    );
  }

  // prettier-ignore
  public async getEvent(id: number): Promise<Event | undefined> {
    const query = await this
    .getEventsWithAttendeeCountQuery()
    .andWhere('e.id = :id',{ id },);
    // this.logger.debug(query.getSql()); //prints out the sql that would be generated to execute this query
    return query.getOne();
  }
}

// return await this.getEventsBaseQuery()
//       .andWhere('e.id = :id', { id }) //{id} tells andWhere what argument to bind
//       .getOne();
