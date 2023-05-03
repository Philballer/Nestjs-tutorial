import { CreateEventDto, UpdateEventDto } from './input/event.dto';
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  ParseIntPipe,
  ValidationPipe,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
  NotFoundException,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from 'src/attendee/attendee.entity';
import { EventsService } from './events.service';
import { ListEvents } from './input/list.events';
import { log } from 'console';
import { EventDebugs } from './helpers/string-enums';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    private eventService: EventsService,
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly AttendeeRepository: Repository<Attendee>,
  ) {}

  // prettier-ignore
  @Get() //Get all events
  @UsePipes(new ValidationPipe({ transform: true}))
  async findAll(@Query() filter: ListEvents) {
    this.logger.log(filter.when? `hit the get-all end-point with query ${filter.when}` : EventDebugs.hitFindAll);
    const events = await this.eventService
    .getEventsWithAttendeeCountFilteredPaginated(filter, 
      {
        total: true,
        currentPage: filter.page,
        limit:10
      });
    return events;
  }

  @Get('practice') //getting all attendees of the event
  async practice() {
    const event = await this.repository.findOneBy({ id: 5 });
    const attendee = new Attendee();
    attendee.name = 'Phil';
    attendee.event = event;

    await this.AttendeeRepository.save(attendee);
    return `Attendee ${attendee.name} would now be attending event with id:${event.id}`;
  }

  @Get(':id') //Get one event
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.eventService.deleteEvent(id);
    throw new NotFoundException();
  }

  @Post() //create an event
  async create(@Body() input: CreateEventDto) {
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id') //update an event, better than Put, to avoid sending complete object
  async update(@Param('id') id, @Body() input: UpdateEventDto) {
    const event = await this.repository.findOneBy({ id: id });

    if (!event) {
      throw new NotFoundException();
    }

    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id') //delete an event
  @HttpCode(204) //Best code for delete. @HttpCode allows you to set your code
  async remove(@Param('id') id) {
    try {
      const result = await this.eventService.deleteEvent(id);
      if (result?.affected !== 1) {
        throw new NotFoundException();
      }
      // const event = await this.repository.findOneBy({ id: id }); // i used the destructuring of params here
      // await this.repository.remove(event); // an event is passed as an argument here
    } catch (error) {
      if (error.name === 'MustBeEntityError') {
        throw new BadRequestException(`Event with id:${id} not found`);
      } else {
        throw new HttpException(
          'internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}

// @Get('/practice')
// async practice() {
//   return await this.repository.find({
//     where: { id: 3 },
//   });
// }

// this.logger.log('Hit events[1] end-point');
//     const data = await this.repository.findOne({
//       where: { id: 1 },
//       relations: ['attendees'],
//     });
//     this.logger.debug(
//       `Found ${data ? 1 : 0} Event with ${data.attendees.length} attendees`,
//     );
//     return data;
