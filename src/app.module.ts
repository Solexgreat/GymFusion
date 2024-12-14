import { Module } from '@nestjs/common';
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
import { EmailService } from './email/email.services';

@Module({
  imports: [
    ConfigModule.forRoot({
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
  ],
  controllers: [AppController],
  providers: [
    AppService, {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    EmailService,
  ]
})
export class AppModule {}