import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { Board } from './entities/board.entity';
import { TaskList } from '../task-lists/entities/task-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, TaskList])],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
