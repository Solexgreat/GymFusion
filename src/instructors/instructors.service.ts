import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Gym } from 'src/gyms/entities/gym.entity';
import { EntityManager, Repository } from 'typeorm';
import { Instructor } from './entities/instructor.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class InstructorsService {
  constructor(
    @InjectRepository(Gym)
    private readonly gymRepository: Repository<Gym>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>,
    // private userService: UserService,
  ){}
  async createInstructorFromUser(userId: string, gymId: string, manager: EntityManager): Promise<Instructor> {
    const user = await manager.findOne(User, { where: { id: userId } });
    const gym = await manager.findOne(Gym, { where: { id: gymId } });

    if (!gym) {
      throw new NotFoundException('Gym not found');
    }

    const instructor = manager.create(Instructor, { user, gym });
    return await manager.save(instructor);
  }

  async getAllInstructors(): Promise<Instructor[]> {
    //return instructors with  gym details
    return this.instructorRepository.find({ relations: ['gym'] });
  }

  async getInstructorById(id: string): Promise<Instructor> {
  const instructor = await this.instructorRepository.findOne({ where: { id }, relations: ['gym'] });
  if (!instructor) {
    throw new NotFoundException('Instructor not found');
  }
  return instructor;
}

async createInstructorDirectly(createInstructorDto: CreateInstructorDto): Promise<Instructor> {
  const { userId, gymId } = createInstructorDto;

  // Find the user and gym
  const user = await this.userRepository.findOne({ where: { id: userId } });
  const gym = await this.gymRepository.findOne({ where: { id: gymId } });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (!gym) {
    throw new NotFoundException('Gym not found');
  }

  // Ensure the user has the role 'Instructor'
  user.role = Role.instructor;
  await this.userRepository.save(user);

  // Create the Instructor record
  const instructor = this.instructorRepository.create({
    user,
    gym,
  });

  return await this.instructorRepository.save(instructor);
}

async updateInstructor(id: string, updateInstructorDto: UpdateInstructorDto): Promise<Instructor> {

  //Verify the instructor
  const instructor = await this.instructorRepository.findOne({ where: { id } });
  if (!instructor) {
    throw new NotFoundException('Instructor not found');
  }

  //Verify if the gym exist and update it
  if (updateInstructorDto.gymId) {
    const gym = await this.gymRepository.findOne({ where: { id: updateInstructorDto.gymId } });
    if (!gym) {
      throw new NotFoundException('Gym not found');
    }
    instructor.gym = gym;
  }

  Object.assign(instructor, updateInstructorDto);
  return this.instructorRepository.save(instructor);
}

async deleteInstructor(id: string): Promise<void> {
  const result = await this.instructorRepository.delete(id);
  if (result.affected === 0) {
    throw new NotFoundException('Instructor not found');
  }
}

async getInstructorsByGym(gymId: string): Promise<Instructor[]> {
  const gym = await this.gymRepository.findOne({where: {id: gymId}, relations: ['instructors']})

  if (!gym){
    throw new NotFoundException('Gym not Found')
  }

  return gym.instructors
}
}
