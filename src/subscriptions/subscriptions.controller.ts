import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { RolesGurd } from 'src/auth/guards/role.guard';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Public()
  @Post()
  async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Query('email') email: string,
  ) {
    return await this.subscriptionsService.createSubscription(
      createSubscriptionDto,
      email,
    );
  }

  // Get all subscriptions for a user by email
  @UseGuards(RolesGurd)
  @Roles(Role.superUser)
  @Get('user')
  async getUserSubscriptions(@Query('email') email: string) {
    return await this.subscriptionsService.getUserSubscriptions(email);
  }

  // Get a subscription by ID
  @Get(':id')
  async getSubscriptionById(@Param('id') subscriptionId: string) {
    return await this.subscriptionsService.getSubscriptionById(subscriptionId);
  }

  // Update a subscription by ID
  @Patch(':id')
  async updateSubscription(
    @Param('id') subscriptionId: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return await this.subscriptionsService.updateSubscription(
      subscriptionId,
      updateSubscriptionDto,
    );
  }

  // Delete a subscription by ID
  @Delete(':id')
  async deleteSubscription(@Param('id') subscriptionId: string) {
    return await this.subscriptionsService.deleteSubscription(subscriptionId);
  }

  // Get all active subscriptions
  @UseGuards(RolesGurd)
  @Roles(Role.superUser)
  @Get('active')
  async getActiveSubscriptions() {
    return await this.subscriptionsService.getActiveSubscriptions();
  }

  // Renew a subscription
  @Patch(':id/renew')
  async renewSubscription(
    @Param('id') subscriptionId: string,
    @Query('days') additionalDays: number,
  ) {
    return await this.subscriptionsService.renewSubscription(
      subscriptionId,
      additionalDays,
    );
  }

  // Cancel a subscription
  @Patch(':id/cancel')
  async cancelSubscription(@Param('id') subscriptionId: string) {
    return await this.subscriptionsService.cancelSubscription(subscriptionId);
  }
}