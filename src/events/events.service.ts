import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';
import { AttendeeAnswerEnum } from 'src/attendee/attendee.entity';
import { ListEvents, WhenEventFilter } from './input/list.events';
import { PaginateOptions, paginate } from 'src/pagination/paginator';
import { CreateEventDto, UpdateEventDto } from './input/event.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  private getEventsBaseQuery() {
    return this.eventsRepository.createQueryBuilder('e').orderBy('e.id', 'ASC');
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

  private async getEventsWithAttendeeCountFiltered(filter?: ListEvents) {
    let query = this.getEventsWithAttendeeCountQuery();

    if (filter.when) {
      let target = null;
      if (typeof filter.when === 'string') {
        target = parseInt(filter.when);
      }
      switch (target) {
        case WhenEventFilter.Today: {
          query = query.andWhere(
            `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`,
          );
          break;
        }
        case WhenEventFilter.Tomorrow: {
          query = query.andWhere(
            `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY`,
          );
          break;
        }
        case WhenEventFilter.ThisWeek: {
          query = query.andWhere(
            'YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)',
          );
          break;
        }
        case WhenEventFilter.NextWeek: {
          query = query.andWhere(
            'YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1',
          );
          break;
        }
      }

      return query;
    }

    return query;
  }

  public async getEventsWithAttendeeCountFilteredPaginated(
    filter: ListEvents,
    paginateOptions: PaginateOptions,
  ) {
    return await paginate(
      await this.getEventsWithAttendeeCountFiltered(filter),
      paginateOptions,
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

  public async createEvent(input: CreateEventDto, user: User): Promise<Event> {
    return await this.eventsRepository.save({
      ...input,
      organizer: user,
      when: new Date(input.when),
    });
  }

  public async updateEvent(
    event: Event,
    input: UpdateEventDto,
  ): Promise<Event> {
    return await this.eventsRepository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  public async deleteEvent(id: number) {
    return await this.eventsRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}

// return await this.getEventsBaseQuery()
//       .andWhere('e.id = :id', { id }) //{id} tells andWhere what argument to bind
//       .getOne();
