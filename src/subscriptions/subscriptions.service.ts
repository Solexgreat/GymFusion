import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SubscriptionsService {

  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private readonly userService: UserService,
  ){}

  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
    email: string,
  ) {
    // Find the user by email
    const user = await this.userService.findOneByEmail(email);

    // Ensure no duplicate subscription for the same user and gym
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        user: { id: user.id },
        gym: { id: createSubscriptionDto.gymId},
        status: 'active',
      },
    });

    if (existingSubscription) {
      throw new ConflictException('Active subscription already exists for this user and gym');
    }

    // Create a new subscription
    const subscription = this.subscriptionRepository.create({
      user,
      gym: { id: createSubscriptionDto.gymId },
      plan: createSubscriptionDto.plan,
      startDate: new Date(),
      endDate: createSubscriptionDto.endDate,
      status: 'active',
    });

    try {
      // Save and return the subscription
      const savedSubscription = await this.subscriptionRepository.save(subscription);
      return savedSubscription;
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while saving the subscription');
    }
  }

  async getUserSubscriptions(email: string): Promise<Subscription[]> {
    const subscription = await this.subscriptionRepository.find({
      where: {user: {email: email}},
      relations: ['user']
    });
    return subscription
  }


  async getSubscriptionById(subscriptionId: string): Promise<Subscription> {
    return await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
      relations: ['user'],
    });
  }

  async updateSubscription(subscriptionId: string, updateSubscriptionDto: UpdateSubscriptionDto): Promise<Subscription>{
    const subscription = await this.subscriptionRepository.findOneBy({id: subscriptionId})

    if (subscription){
      throw new ConflictException('No previous subscription')
    }

    Object.assign(subscription, updateSubscriptionDto)
    return await this.subscriptionRepository.save(subscription);
  }

  async deleteSubscription(subscriptionId: string): Promise<void>{
    const subscription = await this.subscriptionRepository.findOneBy({id: subscriptionId})

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    await this.subscriptionRepository.remove(subscription);
  }

  async getActiveSubscriptions(){
    const currentDate = new Date
    return await this.subscriptionRepository.find({
      where: {
        startDate: LessThanOrEqual(currentDate),
        endDate: MoreThan(currentDate)
      }
    })
  }

  async renewSubscription(subscriptionId: string, additionalDays: number): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOneBy({ id: subscriptionId });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    subscription.endDate = new Date(subscription.endDate.getTime() + additionalDays * 24 * 60 * 60 * 1000);
    return await this.subscriptionRepository.save(subscription);
  }

  async cancelSubscription(subscriptionId: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOneBy({ id: subscriptionId });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    subscription.endDate = new Date

    return await this.subscriptionRepository.save(subscription);
  }

}
