import { CreateEventDto, UpdateEventDto } from './create-event.dto';
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
} from '@nestjs/common';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  @Get() //Get all events
  async findAll() {
    this.logger.log('Hit the findAll route');
    const events = await this.repository.find();
    this.logger.debug(`Found ${events.length} events`);
    return events;
  }

  @Get(':id') //Get one event
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.repository.findOneBy({ id: id });
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
      const event = await this.repository.findOneBy({ id: id }); // i used the destructuring of params here
      await this.repository.remove(event); // an event is passed as an argument here
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
