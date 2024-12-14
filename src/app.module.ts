import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { InstructorsModule } from './instructors/instructors.module';
import { GymModule } from './gyms/gym.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ClassModule } from './class/class.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true,
      entities: [__dirname + '/**/*.entity{.ts}'],
      options: {
        encrypt: false,
      },
    }),
    UserModule,
    GymModule,
    SubscriptionsModule,
    InstructorsModule,
    AuthModule,
    ClassModule,
    ScheduleModule,
  ],
})
export class AppModule {}

// give e a step b step process of setting up my mssql  Locally in nest.js

// I just install SSMS-setup-ENU, but I don't know where to access and start using it