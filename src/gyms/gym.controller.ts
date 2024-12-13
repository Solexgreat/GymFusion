import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { GymService } from './gym.service';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { CreateGymOwnerDto } from './dto/create-gym.owner';

@Controller('gyms')
export class GymController {
  constructor(private readonly gymService: GymService) {}

  @Post()
  async createGym(@Body() createGymDto: CreateGymDto) {
    return await this.gymService.createGym(createGymDto);
  }

  @Post('assign-owner')
  async assignGymOwner(@Body() createGymOwnerDto: CreateGymOwnerDto) {
    return await this.gymService.createGymOwner(createGymOwnerDto);
  }

  @Get()
  async getAllGyms() {
    return await this.gymService.getAllGyms();
  }

  @Get(':id')
  async getGymById(@Param('id') id: string) {
    return await this.gymService.getGymById(id);
  }

  @Put(':id')
  async updateGym(@Param('id') id: string, @Body() updateGymDto: UpdateGymDto) {
    return await this.gymService.updateGym(id, updateGymDto);
  }

  @Delete(':id')
  async deleteGym(@Param('id') id: string) {
    return await this.gymService.deleteGym(id);
  }
}