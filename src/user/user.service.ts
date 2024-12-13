import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { Role } from 'src/enums/role.enum';
import { InstructorsService } from 'src/instructors/instructors.service';
import { Gym } from 'src/gyms/entities/gym.entity';
import { GymService } from 'src/gyms/gym.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Gym)
    private gymRepository: Repository<Gym>,

    private readonly instructorService: InstructorsService,
    private readonly gymService : GymService,
    private dataSource: DataSource,
  ){}


 async create(createUserDto: CreateUserDto): Promise<User> {
  const { email, password, confirmPassword } = createUserDto;

  //verify if password match
  if (password != confirmPassword){
    throw new BadRequestException("password doesn't match confirmPassword")
  }
  //Check if user exist
  const existingUser = await this.userRepository.findOne({ where: {email}})
  if (existingUser){
    throw new ConflictException('User already exist')
  }

  //hash password and save new user
  const hashedPassword = await argon2.hash(password);
  const newUser = this.userRepository.create({
    ...createUserDto,
    password: hashedPassword
  })
  try{
    const savedUser = await this.userRepository.save(newUser)

    return savedUser
  } catch (error) {
    throw new InternalServerErrorException('Error occur while saving user')
  }
  }

  async createAdmin(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, confirmPassword } = createUserDto;

    //verify if password match
    if (password != confirmPassword){
      throw new BadRequestException("password doesn't match confirmPassword")
    }
    //Check if user exist
    const existingUser = await this.userRepository.findOne({ where: {email}})
    if (existingUser){
      throw new ConflictException('User already exist')
    }

    //hash password and save SuperUser
    const hashedPassword = await argon2.hash(password);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: Role.superUser
    })
    try{
      const savedUser = await this.userRepository.save(newUser)

      return savedUser
    } catch (error) {
      throw new InternalServerErrorException('Error occur while saving user')
    }
    }

    async createUserAsInstructor(createUserDto: CreateUserDto, gymId: string): Promise<User> {
      // Start a transaction
      return await this.dataSource.transaction(async (manager) => {
        // Create the user within the transaction
        const user = manager.create(User, {
          ...createUserDto,
          role: Role.instructor,
        });

        const savedUser = await manager.save(user);

        // Create the instructor and associate with the gym within the transaction
        await this.instructorService.createInstructorFromUser(savedUser.id, gymId, manager);

        return savedUser; // Return the user, which will be committed with the transaction
      }).catch((error) => {
        throw new InternalServerErrorException('Error occurred while creating user or instructor');
      });
  }

  async createUserAsGymOwner(createUserDto: CreateUserDto, gymId: string): Promise<User> {
    // Create the user
    const user =  this.userRepository.create(createUserDto);

   // Assign the user the GymOwner role
    user.role = Role.gymOwner;
    await this.userRepository.save(user);

    // Create the GymOwner relationship (link the user to the gym)
    await this.gymService.linkGymOwnerToGym(user.id, gymId);

    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOneByEmail(email: string) {
    const user = this.userRepository.findOne({ where: {email}})

    //verify and return user
    if (!user){
      throw new NotFoundException('user not found')
    }
    return user;
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } })
    return user
  }

  async saveRefreshToken(email: string, refreshToken: string){
    const user = await this.findOneByEmail(email)

    const hashedRefreshToken = await argon2.hash(refreshToken)

    user.refreshToken = hashedRefreshToken
    return await this.userRepository.save(user)
  }

  async findUserByRefreshToken(email: string, refreshToken: string): Promise<User> {
    const user = await this.findOneByEmail(email)
    const verifyToken = argon2.verify(user.refreshToken, refreshToken)

    if (!verifyToken) {
      throw new UnauthorizedException('Refresh token is invalid')
    }

    return user
  }

  async removeRefreshToken(email: string): Promise<User> {
    const user = await this.findOneByEmail(email)

    user.refreshToken = null
    return await this.userRepository.save(user)
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
