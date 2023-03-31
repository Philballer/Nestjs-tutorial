import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn() //this would serve as key id in the DB
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'when_date' })
  when: Date;

  @Column()
  address: string;
}
