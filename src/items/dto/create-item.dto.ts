import { IsString, IsInt, IsEmail } from 'class-validator';
import { isNumber } from 'util';
export class CreateItemDto {
  @IsString()
  readonly item: string;
  @IsString()
  readonly description: string;
}
