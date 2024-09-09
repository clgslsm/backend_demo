// src/users/dto/update-user.dto.ts
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nickname of the user',
    example: 'Johnny',
    required: false,
  })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({ description: 'Age of the user', example: 30, required: false })
  @IsInt()
  @IsOptional()
  @Min(0)
  age?: number;
}
