import { CreateEventDto, Event, UpdateEventDto } from './create-event.dto';
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

@Controller('/events')
export class EventsController {
  private events: Event[] = [];

  @Get() //Get all events
  findAll() {
    return this.events;
  }

  @Get(':id') //Get one event
  findOne(@Param() param) {
    const event = this.events.find((event) => event.id === parseInt(param.id));
    return event;
  }

  @Post() //create an event
  create(@Body() input: CreateEventDto) {
    const event = {
      ...input,
      when: new Date(input.when),
      id: this.events.length + 1,
    };

    this.events.push(event);

    return event;
  }

  @Patch(':id') //update an event, better than Put, to avoid sending complete object
  update(@Param() param, @Body() input: UpdateEventDto) {
    const eventIndex = this.events.findIndex(
      (e) => e.id === parseInt(param.id),
    );

    this.events[eventIndex] = {
      ...this.events[eventIndex],
      ...input,
      when: input.when ? new Date(input.when) : this.events[eventIndex].when,
    };

    return this.events[eventIndex];
  }

  @Delete(':id') //delete an event
  @HttpCode(204) //Best code for delete. @HttpCode allows you to set your code
  remove(@Param('id') param) {
    this.events = this.events.filter((e) => e.id !== parseInt(param));
  }
}
