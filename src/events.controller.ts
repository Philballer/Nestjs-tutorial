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
} from '@nestjs/common';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/events')
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  @Get() //Get all events
  async findAll() {
    return await this.repository.find();
  }

  @Get(':id') //Get one event
  async findOne(@Param() param) {
    return await this.repository.findOne(param.id);
  }

  @Post() //create an event
  async create(@Body() input: CreateEventDto) {
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id') //update an event, better than Put, to avoid sending complete object
  async update(@Param() param, @Body() input: UpdateEventDto) {
    const event = await this.repository.findOne(param.id);

    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id') //delete an event
  @HttpCode(204) //Best code for delete. @HttpCode allows you to set your code
  async remove(@Param('id') id) {
    const event = await this.repository.findOne(id); // i used the destructuring of params here
    await this.repository.remove(event); // an event is passed as an argument here
  }
}
