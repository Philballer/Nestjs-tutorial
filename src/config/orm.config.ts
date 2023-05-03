import { Event } from 'src/events/event.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';
import { Attendee } from 'src/attendee/attendee.entity';
import { Subject } from 'src/school/subject.entity';
import { Teacher } from 'src/school/teacher.entity';
import { User } from 'src/auth/user.entity';
import { Profile } from 'src/auth/profile.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3000,
    username: 'root',
    password: 'example',
    database: 'nest-events',
    entities: [Event, Attendee, Subject, Teacher, User, Profile],
    synchronize: true, //automatically updates db schema
  }),
);
