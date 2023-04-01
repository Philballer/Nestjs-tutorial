import { Event } from 'src/events/event.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3000,
    username: 'root',
    password: 'example',
    database: 'nest-events',
    entities: [Event],
    synchronize: true, //automatically updates db schema
  }),
);
