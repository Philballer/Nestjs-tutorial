import { Event } from 'src/events/event.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn() //Key number in DB
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Event, (x) => x.attendees, { nullable: false })
  @JoinColumn() //can help to change name usw when you set the argument in
  event: Event;
}
