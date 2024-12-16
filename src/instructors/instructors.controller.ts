import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { Public } from 'src/auth/decorators/public.decorator';


@Controller('instructors')
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  // Get all instructors
  @Get()
  async getAllInstructors() {
    return await this.instructorsService.getAllInstructors();
  }

  // Get an instructor by ID
  @Get(':id')
  async getInstructorById(@Param('id') id: string) {
    return await this.instructorsService.getInstructorById(id);
  }

  // Get instructors by gym ID
  @Get('gym/:gymId')
  async getInstructorsByGym(@Param('gymId') gymId: string) {
    return await this.instructorsService.getInstructorsByGym(gymId);
  }

  // Create an instructor directly
  @Public()
  @Post()
  async createInstructorDirectly(@Body() createInstructorDto: CreateInstructorDto) {
    return await this.instructorsService.createInstructorDirectly(createInstructorDto);
  }

  // Update an instructor by ID
  @Patch(':id')
  async updateInstructor(
    @Param('id') id: string,
    @Body() updateInstructorDto: UpdateInstructorDto,
  ) {
    return await this.instructorsService.updateInstructor(id, updateInstructorDto);
  }

  // Delete an instructor by ID
  @Delete(':id')
  async deleteInstructor(@Param('id') id: string) {
    return await this.instructorsService.deleteInstructor(id);
  }
}