import { Attendee } from 'src/attendee/attendee.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn() //this would serve as key id in the DB
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  when: Date;

  @Column()
  address: string;

  @OneToMany(() => Attendee, (x) => x.event)
  attendees: Attendee[];
  //first argument is a function that returns the related type
  //second argument is the property on the relation that points to this owning class eg attendee.events point here

  @ManyToOne(() => User, (x) => x.organizedEvents)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Column({ nullable: true })
  organizerId: number;

  attendeeCount?: number;
  attendeeUnanswered?: number;
  attendeeAccepted?: number;
  attendeeRejected?: number;
}

//x is any name from the class which is the first argument. In the second argument x.event is the what it is related to
