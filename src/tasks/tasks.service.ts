import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskList } from '../task-lists/entities/task-list.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(TaskList)
    private readonly taskListRepository: Repository<TaskList>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    let taskListId = createTaskDto.taskListId;

    if (!taskListId) {
      if (!createTaskDto.status || !createTaskDto.boardId) {
        throw new BadRequestException(
          'Either taskListId or both status and boardId must be provided',
        );
      }

      const taskList = await this.taskListRepository.findOne({
        where: {
          name: createTaskDto.status,
          board: { id: createTaskDto.boardId },
        },
      });

      if (!taskList) {
        throw new NotFoundException(
          `Task list with status/name '${createTaskDto.status}' not found on this board`,
        );
      }

      taskListId = taskList.id;
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      taskList: { id: taskListId },
    });
    return this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({
      relations: { taskList: { board: true }, subtasks: true },
      order: { position: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: { taskList: { board: true }, subtasks: true },
    });

    if (!task) {
      throw new NotFoundException(`Task with id '${id}' not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with id '${id}' not found`);
    }

    // If the caller wants to move the task to a different list by status+boardId
    let taskListId = updateTaskDto.taskListId;
    if (!taskListId && updateTaskDto.status && updateTaskDto.boardId) {
      const taskList = await this.taskListRepository.findOne({
        where: {
          name: updateTaskDto.status,
          board: { id: updateTaskDto.boardId },
        },
      });

      if (!taskList) {
        throw new NotFoundException(
          `Task list with status/name '${updateTaskDto.status}' not found on this board`,
        );
      }

      taskListId = taskList.id;
    }

    const {
      taskListId: _tid,
      status: _s,
      boardId: _bid,
      ...fields
    } = updateTaskDto;
    await this.taskRepository.update(id, {
      ...fields,
      ...(taskListId ? { taskList: { id: taskListId } } : {}),
    });

    return this.taskRepository.findOne({
      where: { id },
      relations: { taskList: { board: true }, subtasks: true },
    }) as Promise<Task>;
  }

  async remove(id: string): Promise<{ message: string }> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with id '${id}' not found`);
    }

    await this.taskRepository.remove(task);
    return { message: `Task '${task.title}' deleted successfully` };
  }
}
