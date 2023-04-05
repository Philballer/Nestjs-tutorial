import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  private getAttendeesBaseQuery() {
    return this.attendeeRepository
      .createQueryBuilder('attendee')
      .orderBy('attendee.id', 'DESC');
  }
}
