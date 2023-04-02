import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendee])],
})
export class AttendeeModule {}
