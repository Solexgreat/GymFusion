import { IsNotEmpty, IsEnum, IsDecimal, IsDate, IsUUID } from 'class-validator';
import { Plans } from 'src/enums/plan.enum';

export class CreateSubscriptionDto {
    @IsEnum(Plans)
    plan: Plans;

    @IsDecimal()
    price: number;

    @IsNotEmpty()
    @IsUUID()
    gymId: string; // Gym UUID for association

    @IsDate()
    startDate: Date;

    @IsDate()
    endDate: Date;
}
