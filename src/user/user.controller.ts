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
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Role } from 'src/enums/role.enum';
import { Public } from 'src/auth/decorators/public.decorator';
import { RolesGurd } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/register')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Public()
  @Post('/register-admin')
  async createAdmin(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createAdmin(createUserDto);
  }

  @Public()
  @Post('/instructor/:gymId')
  async createUserAsInstructor(
    @Body() createUserDto: CreateUserDto,
    @Param('gymId') gymId: string,
  ): Promise<User> {
    return await this.userService.createUserAsInstructor(createUserDto, gymId);
  }

  @Public()
  @Post('/gym-owner/:gymId')
  async createUserAsGymOwner(
    @Body() createUserDto: CreateUserDto,
    @Param('gymId') gymId: string,
  ): Promise<User> {
    return await this.userService.createUserAsGymOwner(createUserDto, gymId);
  }

  @UseGuards(RolesGurd)
  @Roles(Role.superUser)
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