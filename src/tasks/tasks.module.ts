import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { Subtask } from './entities/subtask.entity';
import { TaskList } from '../task-lists/entities/task-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Subtask, TaskList])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
