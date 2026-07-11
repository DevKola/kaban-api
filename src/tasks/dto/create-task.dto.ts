import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';

export class CreateTaskDto {
  @ApiProperty({ description: 'The title of the task' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Detailed description of the task' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'The ID of the list this task belongs to',
  })
  @IsUUID()
  @IsOptional()
  taskListId?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    description:
      'The status of the task, used to assign it to the correct list (requires boardId)',
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    description:
      'The ID of the board (required if assigning by status instead of taskListId)',
  })
  @IsUUID()
  @IsOptional()
  boardId?: string;

  @ApiPropertyOptional({
    description: 'The position of the task within the list',
  })
  @IsNumber()
  @IsOptional()
  position?: number;

  @ApiPropertyOptional({ description: 'Due date for the task' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({
    enum: TaskPriority,
    description: 'Priority of the task',
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;
}
