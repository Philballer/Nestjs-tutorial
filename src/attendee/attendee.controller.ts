import { Controller, Get, Logger, Param, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { Repository } from 'typeorm';
import { AttendeeService } from './attendee.service';

@Controller('/attendees')
export class AttendeeController {
  private readonly logger = new Logger(AttendeeController.name);

  constructor(
    private attendeeService: AttendeeService,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  @Get()
  async getAll() {
    this.logger.log('hit the find-all route');
    const attendees = this.attendeeRepository.find();
    this.logger.debug(`Found ${(await attendees).length} attendees`);
    return attendees;
  }

  @Get(':id')
  async getAttendeeGroup(@Param('id', ParseIntPipe) id: number) {
    const attendees = this.attendeeRepository.findBy({});
    return attendees;
  }
}
