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
    let position = createTaskListDto.position;

    if (position === undefined) {
      const maxPositionList = await this.taskListRepository.findOne({
        where: { board: { id: createTaskListDto.boardId } },
        order: { position: 'DESC' },
      });
      position = maxPositionList ? maxPositionList.position + 1 : 0;
    }

    const list = this.taskListRepository.create({
      ...createTaskListDto,
      position,
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
      throw new NotFoundException(`Task list with not found`);
    }

    return list;
  }

  async update(
    id: string,
    updateTaskListDto: UpdateTaskListDto,
  ): Promise<TaskList> {
    const list = await this.findOne(id);

    if (updateTaskListDto.name !== undefined) {
      list.name = updateTaskListDto.name;
    }
    if (updateTaskListDto.position !== undefined) {
      list.position = updateTaskListDto.position;
    }

    return this.taskListRepository.save(list);
  }

  async remove(id: string): Promise<{ message: string }> {
    const list = await this.findOne(id);

    await this.taskListRepository.remove(list);
    return { message: `Task list '${list.name}' deleted successfully` };
  }
}
