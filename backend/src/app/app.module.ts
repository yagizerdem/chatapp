import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from 'src/utility/all-exceptions.filter';
import { ProfileModule } from 'src/profile/profile.module';
import { ContactModule } from 'src/contact/contact.module';
import { SocketModule } from 'src/socket/socket.module';

const path = require('node:path');
const entityPath = path.normalize(__dirname + '/../**/*.entity{.ts,.js}');

@Module({
  imports: [
    AuthModule,
    ProfileModule,
    ContactModule,
    SocketModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './src/database/appDatabase.db', // Path to the SQLite database file
      entities: [entityPath], // Adjust to match your entity file paths
      synchronize: true,
      migrationsTableName: 'Migrations_History',
      logging: true, // Enable logging
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
  /**
   *
   */
  constructor() {}
}
