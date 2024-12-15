import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from 'src/class/entities/class.entity';

@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  // Create a new class
  @Post()
  async createClass(@Body() createClassDto: CreateClassDto): Promise<Class> {
    return this.classService.createClass(createClassDto);
  }

  // Get all classes
  @Get()
  async findAllClass(): Promise<Class[]> {
    return this.classService.findAllClass();
  }

  // Get a single class by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Class> {
    return this.classService.findOneClassbyId(id);
  }

  // Update class details
  @Put(':id')
  async updateClass(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<Class> {
    return this.classService.updateClass(id, updateClassDto);
  }

  // Delete a class by ID
  @Delete(':id')
  async removeClass(@Param('id') id: string): Promise<void> {
    return this.classService.removeClass(id);
  }
}