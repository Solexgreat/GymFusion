import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Gym } from './entities/gym.entity';
import { CreateGymOwnerDto } from './dto/create-gym.owner';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class GymService {

  constructor(
    @InjectRepository(Gym)
    private gymRepository: Repository<Gym>,

    @InjectRepository(User)
    private userRepository: Repository<User>
  ){}
  async createGym(createGymDto: CreateGymDto): Promise<Gym> {
    const gym = this.gymRepository.create(createGymDto);
    return this.gymRepository.save(gym);
  }

  async linkGymOwnerToGym(userId: string, gymId: string): Promise<Gym> {
    const gym = await this.gymRepository.findOne({ where: { id: gymId } });
    if (!gym) {
      throw new Error('Gym not found');
    }

    // Link the gym to the user as the owner
    gym.owner.id = userId;
    return this.gymRepository.save(gym);
  }

  async createGymOwner(createGymOwnerDto: CreateGymOwnerDto): Promise<User> {
    const { userId, gymId } = createGymOwnerDto;

    // Find the user and gym by their IDs
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const gym = await this.gymRepository.findOne({ where: { id: gymId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!gym) {
      throw new NotFoundException('Gym not found');
    }

    // Ensure the user has the role 'GymOwner'
    user.role = Role.gymOwner;
    await this.userRepository.save(user);

    // Assign the user as the gym owner
    gym.owner = user;
    await this.gymRepository.save(gym);

    return user;
  }


  async getAllGym(): Promise<Gym[]> {
    const Gyms = await this.gymRepository.find()
    return Gyms;
  }

  findOne(id: number) {
    return `This action returns a #${id} gym`;
  }

  update(id: number, updateGymDto: UpdateGymDto) {
    return `This action updates a #${id} gym`;
  }

  remove(id: number) {
    return `This action removes a #${id} gym`;
  }
}
