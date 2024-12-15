import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Invoice } from './entities/invoice.entity';
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async savePayment(data: Partial<Payment>): Promise<Payment> {
    const payment = this.paymentRepository.create(data);
    return this.paymentRepository.save(payment);
  }

  async generateInvoice(paymentId: string): Promise<string> {
    const payment = await this.paymentRepository.findOneBy({ id: paymentId });
    if (!payment) throw new Error('Payment not found');
  
    const invoiceNumber = `INV-${Date.now()}`;
    const filePath = path.join(__dirname, `../../invoices/${invoiceNumber}.pdf`);
  
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));
  
    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.text(`Invoice Number: ${invoiceNumber}`);
    doc.text(`Payment ID: ${payment.id}`);
    doc.text(`Amount: ${payment.amount} ${payment.currency}`);
    doc.text(`Status: ${payment.status}`);
    doc.text(`Date: ${payment.createdAt}`);
    doc.end();
  
    const invoice = this.invoiceRepository.create({ paymentId, invoiceNumber, filePath });
    await this.invoiceRepository.save(invoice);
  
    return filePath;
  }

  async getInvoice(invoiceId: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOneBy({ id: invoiceId });
    if (!invoice) throw new Error('Invoice not found');
    return invoice;
  }
}