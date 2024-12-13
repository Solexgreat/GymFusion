import { IsNotEmpty } from 'class-validator';

export class CreateGymDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  location: string;

}
