import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { InstructorsModule } from './instructors/instructors.module';
import { GymModule } from './gyms/gym.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ClassModule } from './class/class.module';
import { ScheduleModule } from './schedule/schedule.module';
import ormconfig from './config/ormconfig';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email/email.services';
import { StripeModule } from './stripe/stripe.module';
import { PaymentsModule } from './payments/payment.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Global()
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [ormconfig]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('typeorm')
      }),
      inject: [ConfigService]
    }),
    UserModule,
    GymModule,
    SubscriptionsModule,
    InstructorsModule,
    AuthModule,
    ClassModule,
    ScheduleModule,
    StripeModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    EmailService,
    JwtService,
  ]
})
export class AppModule {}