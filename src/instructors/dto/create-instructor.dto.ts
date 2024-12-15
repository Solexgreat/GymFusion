import { IsNotEmpty, IsUUID } from 'class-validator';


export class CreateInstructorDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  gymId: string;
}
