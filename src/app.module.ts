import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './events/event.entity';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import { SchoolModule } from './school/school.module';
import { AttendeeModule } from './attendee/attendee.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig, // cleaned up sql settings in config
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
    }),
    EventsModule,
    AttendeeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
