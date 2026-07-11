import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTaskListDto {
  @ApiProperty({ description: 'The name of the list (e.g., Todo, Doing)' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The ID of the board this list belongs to' })
  @IsUUID()
  @IsNotEmpty()
  boardId: string;

  @ApiPropertyOptional({ description: 'The position of the list for ordering' })
  @IsNumber()
  @IsOptional()
  position?: number;
}
