import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskListDto } from './dto/create-task-list.dto';
import { TaskList } from './entities/task-list.entity';
import { UpdateTaskListDto } from './dto/update-task-list.dto';

@Injectable()
export class TaskListsService {
  constructor(
    @InjectRepository(TaskList)
    private readonly taskListRepository: Repository<TaskList>,
  ) {}

  async create(createTaskListDto: CreateTaskListDto): Promise<TaskList> {
    const list = this.taskListRepository.create({
      ...createTaskListDto,
      board: { id: createTaskListDto.boardId },
    });
    return this.taskListRepository.save(list);
  }

  async findAll(): Promise<TaskList[]> {
    return this.taskListRepository.find({
      relations: { board: true, tasks: { subtasks: true } },
      order: { position: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TaskList> {
    const list = await this.taskListRepository.findOne({
      where: { id },
      relations: { board: true, tasks: { subtasks: true } },
    });

    if (!list) {
      throw new NotFoundException(`Task list with id '${id}' not found`);
    }

    return list;
  }

  async update(
    id: string,
    updateTaskListDto: UpdateTaskListDto,
  ): Promise<TaskList> {
    const list = await this.taskListRepository.findOne({ where: { id } });

    if (!list) {
      throw new NotFoundException(`Task list with id '${id}' not found`);
    }

    const { boardId: _bid, ...fieldsToUpdate } = updateTaskListDto;
    await this.taskListRepository.update(id, fieldsToUpdate);
    return this.taskListRepository.findOne({
      where: { id },
      relations: { board: true, tasks: true },
    }) as Promise<TaskList>;
  }

  async remove(id: string): Promise<{ message: string }> {
    const list = await this.taskListRepository.findOne({ where: { id } });

    if (!list) {
      throw new NotFoundException(`Task list with id '${id}' not found`);
    }

    await this.taskListRepository.remove(list);
    return { message: `Task list '${list.name}' deleted successfully` };
  }
}
