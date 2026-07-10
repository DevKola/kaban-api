import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskListsService } from './task-lists.service';
import { TaskList } from './entities/task-list.entity';
import { TaskListsController } from './task-lists.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TaskList])],
  controllers: [TaskListsController],
  providers: [TaskListsService],
})
export class TaskListsModule {}
