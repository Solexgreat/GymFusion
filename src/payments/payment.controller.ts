import { Controller, Post, Body, Param, Res, Get } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('save-payment')
  async savePayment(@Body() body: any) {
    return this.paymentsService.savePayment(body);
  }

  @Post('generate-invoice/:paymentId')
  async generateInvoice(@Param('paymentId') paymentId: string) {
    return this.paymentsService.generateInvoice(paymentId);
  }

  @Get('download-invoice/:invoiceId')
  async downloadInvoice(@Param('invoiceId') invoiceId: string, @Res() res: Response) {
    const invoice = await this.paymentsService.getInvoice(invoiceId);
    res.download(invoice.filePath);
  }
}