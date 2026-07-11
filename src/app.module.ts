import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { TaskListsModule } from './task-lists/task-lists.module';
import { BoardsModule } from './boards/boards.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        username: 'postgres',
        password: 'postgres',
        host: 'localhost',
        port: 5432,
        database: 'kaban-db',
      }),
    }),
    TasksModule,
    TaskListsModule,
    BoardsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
