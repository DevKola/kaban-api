import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TaskListsService } from './task-lists.service';
import { CreateTaskListDto } from './dto/create-task-list.dto';
import { UpdateTaskListDto } from './dto/update-task-list.dto';
import { TaskList } from './entities/task-list.entity';

@Controller('task-lists')
export class TaskListsController {
  constructor(private readonly taskListsService: TaskListsService) {}

  @Post()
  create(@Body() createTaskListDto: CreateTaskListDto): Promise<TaskList> {
    return this.taskListsService.create(createTaskListDto);
  }

  @Get()
  findAll(): Promise<TaskList[]> {
    return this.taskListsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<TaskList> {
    return this.taskListsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskListDto: UpdateTaskListDto,
  ): Promise<TaskList> {
    return this.taskListsService.update(id, updateTaskListDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.taskListsService.remove(id);
  }
}
