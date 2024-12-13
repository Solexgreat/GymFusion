import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from 'src/class/entities/class.entity';
import { Gym } from 'src/gyms/entities/gym.entity';
import { Instructor } from 'src/instructors/entities/instructor.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Gym)
    private gymRepository: Repository<Gym>,
    @InjectRepository(Instructor)
    private instructorRepository: Repository<Instructor>,
  ) {}

  async createClass(createClassDto: CreateClassDto): Promise<Class> {
    const { name, description, instructorId, gymId } = createClassDto;

    let instructor = null;
    let gym = null;

    if (instructorId) {
      instructor = await this.instructorRepository.findOne({ where: { id: instructorId } });
      if (!instructor) {
        throw new NotFoundException('Instructor not found');
      }
    }

    if (gymId) {
      gym = await this.gymRepository.findOne({ where: { id: gymId } });
      if (!gym) {
        throw new NotFoundException('Gym not found');
      }
    }

    const newClass = this.classRepository.create({
      name,
      description,
      instructor,
      gym,
    });

    return await this.classRepository.save(newClass);
  }

  async findAllClass(): Promise<Class[]> {
    return await this.classRepository.find({
      relations: ['instructor', 'gym', 'schedules'],
    });
  }

  async findOneClassbyId(id: string): Promise<Class> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['instructor', 'gym', 'schedules'],
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    return classEntity;
  }


  async updateClass(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    const classEntity = await this.classRepository.findOne({ where: { id } });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    const { name, description, instructorId, gymId } = updateClassDto;

    if (instructorId) {
      const instructor = await this.instructorRepository.findOne({ where: { id: instructorId } });
      if (!instructor) {
        throw new NotFoundException('Instructor not found');
      }
      classEntity.instructor = instructor;
    }

    if (gymId) {
      const gym = await this.gymRepository.findOne({ where: { id: gymId } });
      if (!gym) {
        throw new NotFoundException('Gym not found');
      }
      classEntity.gym = gym;
    }

    if (name) classEntity.name = name;
    if (description) classEntity.description = description;

    return await this.classRepository.save(classEntity);
  }

  async removeClass(id: string): Promise<void> {
    const classEntity = await this.classRepository.findOne({ where: { id } });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    await this.classRepository.delete(id);
  }
}