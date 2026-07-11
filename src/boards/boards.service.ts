import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const board = this.boardRepository.create({ name: createBoardDto.name });
    const savedBoard = await this.boardRepository.save(board);

    const defaultLists = ['Todo', 'Doing', 'Done'];
    for (const name of defaultLists) {
      const list = this.taskListRepository.create({ name, board: savedBoard });
      await this.taskListRepository.save(list);
    }

    return this.boardRepository.findOne({
      where: { id: savedBoard.id },
      relations: { taskLists: true },
    }) as Promise<Board>;
  }

  async findAll(): Promise<Board[]> {
    return this.boardRepository.find({
      relations: { taskLists: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: { id },
      relations: { taskLists: { tasks: { subtasks: true } } },
    });

    if (!board) {
      throw new NotFoundException(`Board with id '${id}' not found`);
    }

    return board;
  }

  async update(id: string, updateBoardDto: UpdateBoardDto): Promise<Board> {
    const board = await this.boardRepository.findOne({ where: { id } });

    if (!board) {
      throw new NotFoundException(`Board with id '${id}' not found`);
    }

    await this.boardRepository.update(id, updateBoardDto);
    return this.boardRepository.findOne({
      where: { id },
      relations: { taskLists: true },
    }) as Promise<Board>;
  }

  async remove(id: string): Promise<{ message: string }> {
    const board = await this.boardRepository.findOne({ where: { id } });

    if (!board) {
      throw new NotFoundException(`Board with id '${id}' not found`);
    }

    await this.boardRepository.remove(board);
    return { message: `Board '${board.name}' deleted successfully` };
  }
}
