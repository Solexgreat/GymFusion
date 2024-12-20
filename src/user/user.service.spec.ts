import {Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PasswordReset } from './entities/password.entity';
import { InstructorsService } from 'src/instructors/instructors.service';
import { GymService } from 'src/gyms/gym.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { get } from 'http';
import { CreateClassDto } from './../class/dto/create-class.dto';
import { BadRequestException } from '@nestjs/common';


jest.mock('argon2')

describe('UserService', () =>{
    let service: UserService;
    let userRepository: Repository<User>;
    let passwordResetRepository: Repository<PasswordReset>;
    let instructsService: InstructorsService;
    let gymServcie: GymService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(PasswordReset),
                    useClass: Repository,
                },
                {
                    provide: InstructorsService,
                    useValue: { createInstructorFromUser: jest.fn() }
                },
                {
                    provide: GymService,
                    useValue: { linkGymOwnerToGym: jest.fn() }
                },
            ],
        }).compile()

        service = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        passwordResetRepository = module.get<Repository<PasswordReset>>(getRepositoryToken(PasswordReset));
        instructsService = module.get<InstructorsService>(InstructorsService);
        gymServcie = module.get<GymService>(GymService);
    });

    describe('create', () =>{
        it('should create a new user when valid data is provided', async ()=> {
            const createUserDto = {
                firstName: 'testFirstName',
                lastName: 'testLastName',
                email: 'test@Example.com',
                password: 'testPassword',
                confirmPassword: 'testPassword',
                gender: 'Male',
                dateOfBirth: '04-04-1994',
                username: 'testUserName',
            };
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
        jest.spyOn(argon2, 'hash').mockResolvedValue('hashTestPassword');
        jest.spyOn(userRepository, 'save').mockResolvedValue({ id: '1', ...createUserDto });

        const result = await service.create(createUserDto)

        expect(result).toEqual({ id: '1', ...createUserDto });
        expect(userRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({ email: createUserDto.email, password: 'hashedPassword123' })
        );
        });

        it('should throw BadRequestException when password does not match', async ()=> {
            const createUserDto = {
                firstName: 'testFirstName',
                lastName: 'testLastName',
                email: 'test@Example.com',
                password: 'testPassword',
                confirmPassword: 'wrongPassword',
                gender: 'Male',
                dateOfBirth: '04-04-1994',
                username: 'testUserName',
            }

        await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
        });

        it ('should throw ConfilctException when user email already exist', async ()=>{
            const createUserDto = {
                firstName: 'testFirstName',
                lastName: 'testLastName',
                email: 'test@Example.com',
                password: 'testPassword',
                confirmPassword: 'wrongPassword',
                gender: 'Male',
                dateOfBirth: '04-04-1994',
                username: 'testUserName',
            }

        jest.spyOn(userRepository, 'findOne').mockResolvedValue({id:'1', email:'test@Example.com'} as User)

        await expect(service.create(createUserDto)).rejects.toThrow('ConfilctException');
        });

        it ('should throw InternalServerErrorException if user save fails', async () => {
            const createUserDto = {
                firstName: 'testFirstName',
                lastName: 'testLastName',
                email: 'test@Example.com',
                password: 'testPassword',
                confirmPassword: 'wrongPassword',
                gender: 'Male',
                dateOfBirth: '04-04-1994',
                username: 'testUserName',
            }

        jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
        jest.spyOn(argon2, 'hash').mockResolvedValue('hastTestPassword');
        jest.spyOn(userRepository, 'save').mockRejectedValue(new Error ('User fialed to save'))

        await expect(service.create(createUserDto)).rejects.toThrow('InternalServerErrorException')
        });
    });
})
