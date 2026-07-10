import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { TaskListsModule } from './task-lists/task-lists.module';
import { BoardsModule } from './boards/boards.module';

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
  providers: [AppService],
})
export class AppModule {}
