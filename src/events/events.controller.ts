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
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { ListEvents } from './input/list.events';
import { log } from 'console';
import { EventDebugs } from './helpers/string-enums';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { AuthGuardJwt } from 'src/auth/passport-strategies/strategy-exports/auth-guard.jwt';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    private eventService: EventsService, // @InjectRepository(Event)
  ) // private readonly repository: Repository<Event>,
  // @InjectRepository(Attendee)
  // private readonly AttendeeRepository: Repository<Attendee>,
  // * Avoid injecting repos in the controllers, good practice is to inject in the services
  {}

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

  // @Get('practice') //getting all attendees of the event
  // async practice() {
  //   const event = await this.repository.findOneBy({ id: 5 });
  //   const attendee = new Attendee();
  //   attendee.name = 'Phil';
  //   attendee.event = event;

  //   await this.AttendeeRepository.save(attendee);
  //   return `Attendee ${attendee.name} would now be attending event with id:${event.id}`;
  // }

  @Get(':id') //Get one event
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.eventService.getEvent(id);
    this.logger.log(
      `Get single event endpoint hit: ${result ? '1' : '0'} Entry`,
    );
    if (!result) throw new NotFoundException(`Event with id:${id} not found`);
    return result;
  }

  @Post() //create an event
  @UseGuards(AuthGuardJwt)
  async create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    return await this.eventService.createEvent(input, user);
  }

  @Patch(':id') //update an event, better than Put, to avoid sending complete object
  @UseGuards(AuthGuardJwt)
  async update(
    @Param('id') id,
    @Body() input: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventService.getEvent(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        'Current user not authorized to change this event',
      );
    }

    return this.eventService.updateEvent(event, input);
  }

  @Delete(':id') //delete an event
  @HttpCode(204) //Best code for delete. @HttpCode allows you to set your code
  @UseGuards(AuthGuardJwt)
  async remove(@Param('id') id, @CurrentUser() user: User) {
    this.logger.log('Delete event endpoint hit');
    const event = await this.eventService.getEvent(id);
    if (!event) throw new NotFoundException();
    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        'Current user not authorized to delete this event',
      );
    }
    await this.eventService.deleteEvent(id);
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
