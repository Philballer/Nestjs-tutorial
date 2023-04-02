import { Attendee } from 'src/attendee/attendee.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

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
}

//x is any name from the class which is the first argument. In the second argument x.event is the what it is related to
