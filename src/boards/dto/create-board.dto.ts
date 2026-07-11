import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({ description: 'The name of the board' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
