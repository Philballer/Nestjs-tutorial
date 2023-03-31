import { PartialType } from '@nestjs/mapped-types';

export class CreateEventDto {
  name: string;
  description: string;
  when: string;
  address: string;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
