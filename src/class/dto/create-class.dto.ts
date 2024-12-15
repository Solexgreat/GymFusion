import { IsString, IsOptional, IsUUID, IsNotEmpty} from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  gymId?: string;

  @IsUUID()
  @IsOptional()
  instructorId?: string;
}