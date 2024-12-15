import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateGymOwnerDto {
    @IsNotEmpty()
    @IsUUID()
    userId: string;  // ID of the User to be assigned as a GymOwner

    @IsNotEmpty()
    @IsUUID()
    gymId: string;   // ID of the Gym the user will own
  }
