import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsString, Length } from 'class-validator';

export class CreateEventDto {
  @IsString() //these are all validators
  @Length(5, 255)
  name: string;

  @Length(5, 255)
  description: string;

  @IsDateString()
  when: string;

  @Length(5, 255) //using same validation different way for groups
  address: string;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}

//We added a code in main ts so we dont need to pass the pipe in the body of the controller
