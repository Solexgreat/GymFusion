import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as generator from 'generate-password'
import * as argon2 from 'argon2';
import { Role } from 'src/enums/role.enum';
import { InstructorsService } from 'src/instructors/instructors.service';
import { Gym } from 'src/gyms/entities/gym.entity';
import { GymService } from 'src/gyms/gym.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PasswordReset } from './entities/password.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Gym)
    private gymRepository: Repository<Gym>,

    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,

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

  async findAll(role?: Role): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    if (role) {
      queryBuilder.where('user.role = :role', { role });
    }
    return await queryBuilder.getMany();
  }

  async findOneByEmail(email: string) {
    const user = this.userRepository.findOne({ where: {email}})

    //verify and return user
    if (!user){
      throw new NotFoundException('user not found')
    }
    return user;
  }

  async findOneById(id: string) {
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

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = Object.assign(user, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);
  }

  async savePasswordResetToken(email: string, token: string) {
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1);

    const user = await this.findOneByEmail(email)

    if(user.passwordReset) {
      await this.passwordResetRepository.remove(user.passwordReset);
    }

    const passwordReset = new PasswordReset();
    passwordReset.user = user;
    passwordReset.token = token;
    passwordReset.expiredAt = expirationTime;

    return await this.passwordResetRepository.save(passwordReset);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    
  }

  async requestPasswordRequest(email: string): Promise<any> {
    const token = this.generateRandomToken(48)

    try {
      await this.sendPasswordResetEmail(email, token);

      await this.savePasswordResetToken(email, token);

      return 'Email successfully sent';
    } catch (error) {
      console.error('Error sending email or saving token:', error.message);
      throw new InternalServerErrorException('Failed to send password reset email');
    }
  }

  async verifyToken(token: string): Promise<PasswordReset> {
    const passwordReset = await this.passwordResetRepository.findOne({ where: {token: token}})

    if (!passwordReset) {
      throw new BadRequestException('Token is not valid')
    }

    const currentDate = new Date()
    if (currentDate > passwordReset.expiredAt){
      throw new BadRequestException('Token is not valid')
    }

    return passwordReset
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto ) {
    const {newPassword, oldPassword} = changePasswordDto;

    const user = await this.findOneById(id);

    const isPasswordSame = await argon2.verify(user.password, oldPassword)
    if ( !isPasswordSame ){
      throw new BadRequestException('Password does not match')
    }

    const hashPassword = await argon2.hash(newPassword)

    user.password = hashPassword;
    await this.userRepository.save(user)

    return user
  }

  private generateRandomToken(lenght: number): string{
    const password = generator.generate({
      length: lenght,
      numbers: true,
      uppercase: true,
      lowercase: true,
      excludeSimilarCharacters: true,
    })

    console.log("password=", password)
    return password
  }
}
