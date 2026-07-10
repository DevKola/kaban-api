import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './entities/board.entity';
import { TaskList } from '../task-lists/entities/task-list.entity';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(TaskList)
    private readonly taskListRepository: Repository<TaskList>,
  ) {}

  async create(createBoardDto: CreateBoardDto) {
    const board = this.boardRepository.create({ name: createBoardDto.name });
    const savedBoard = await this.boardRepository.save(board);

    const defaultLists = ['Todo', 'Doing', 'Done'];
    for (const name of defaultLists) {
      const list = this.taskListRepository.create({ name, board: savedBoard });
      await this.taskListRepository.save(list);
    }

    return savedBoard;
  }

  findAll() {
    return `This action returns all boards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} board`;
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}
