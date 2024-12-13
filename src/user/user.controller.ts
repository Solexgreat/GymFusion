import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Role } from 'src/enums/role.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Post('/admin')
  async createAdmin(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createAdmin(createUserDto);
  }

  @Post('/instructor/:gymId')
  async createUserAsInstructor(
    @Body() createUserDto: CreateUserDto,
    @Param('gymId') gymId: string,
  ): Promise<User> {
    return await this.userService.createUserAsInstructor(createUserDto, gymId);
  }

  @Post('/gym-owner/:gymId')
  async createUserAsGymOwner(
    @Body() createUserDto: CreateUserDto,
    @Param('gymId') gymId: string,
  ): Promise<User> {
    return await this.userService.createUserAsGymOwner(createUserDto, gymId);
  }

  @Get()
  async findAll(@Query('role') role?: Role): Promise<User[]> {
    if (role && !Object.values(Role).includes(role)) {
      throw new BadRequestException('Invalid role');
    }
    return await this.userService.findAll(role);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOneById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string): Promise<void> {
    return await this.userService.deleteUser(id);
  }
}