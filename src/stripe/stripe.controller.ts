import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body('amount') amount: number, @Body('currency') currency: string) {
    return this.stripeService.createPaymentIntent(amount, currency);
  }

  @Get('payment-intent/:id')
  async retrievePaymentIntent(@Param('id') id: string) {
    return this.stripeService.retrievePaymentIntent(id);
  }
}