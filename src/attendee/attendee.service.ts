import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { Repository } from 'typeorm';
import { log } from 'console';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  private getAttendeesBaseQuery() {
    return this.attendeeRepository
      .createQueryBuilder('attendee')
      .orderBy('attendee.id', 'ASC');
  }

  public getAll(): Promise<Attendee[] | undefined> {
    return this.getAttendeesBaseQuery().getMany();
  }
}
