import { join } from 'path';
import { Event } from 'src/events/event.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum AttendeeAnswerEnum {
  Unanswered = 1,
  Accepted,
  Rejected,
}

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn() //Key number in DB
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Event, (x) => x.attendees, { nullable: false })
  @JoinColumn({}) //can help to change name usw when you set the argument in
  event: Event;
  //first argument is a function that returns the related type
  // nullable=fasle so an attendee cannot exist alone without an event

  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Unanswered,
  })
  answer: AttendeeAnswerEnum;
}

// @Column('enum', {
//   enum: AttendeeAnswerEnum,
//   default: AttendeeAnswerEnum.Accepted,
// })
// answer: AttendeeAnswerEnum;
