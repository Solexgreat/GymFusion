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
    private userRepository: Repository<User>,
  ) {}

  async createGym(createGymDto: CreateGymDto): Promise<Gym> {
    const gym = this.gymRepository.create(createGymDto);
    return this.gymRepository.save(gym);
  }

  async linkGymOwnerToGym(userId: string, gymId: string): Promise<Gym> {
    const gym = await this.gymRepository.findOne({ where: { id: gymId } });
    if (!gym) {
      throw new NotFoundException('Gym not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Link the gym to the user as the owner
    user.role = Role.gymOwner;
    await this.userRepository.save(user);

    gym.owner = user;
    return this.gymRepository.save(gym);
  }

  async createGymOwner(createGymOwnerDto: CreateGymOwnerDto): Promise<User> {
    const { userId, gymId } = createGymOwnerDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const gym = await this.gymRepository.findOne({ where: { id: gymId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!gym) {
      throw new NotFoundException('Gym not found');
    }

    user.role = Role.gymOwner;
    await this.userRepository.save(user);

    gym.owner = user;
    await this.gymRepository.save(gym);

    return user;
  }

  async getAllGyms(): Promise<Gym[]> {
    return this.gymRepository.find({ relations: ['owner', 'instructors'] });
  }

  async getGymById(id: string): Promise<Gym> {
    const gym = await this.gymRepository.findOne({
      where: { id },
      relations: ['owner', 'instructors'],
    });
    if (!gym) {
      throw new NotFoundException('Gym not found');
    }
    return gym;
  }

  async updateGym(id: string, updateGymDto: UpdateGymDto): Promise<Gym> {
    const gym = await this.gymRepository.findOne({ where: { id } });
    if (!gym) {
      throw new NotFoundException('Gym not found');
    }

    Object.assign(gym, updateGymDto);
    return this.gymRepository.save(gym);
  }

  async deleteGym(id: string): Promise<void> {
    const gym = await this.gymRepository.findOne({ where: { id } });
    if (!gym) {
      throw new NotFoundException('Gym not found');
    }

    await this.gymRepository.remove(gym);
  }
}