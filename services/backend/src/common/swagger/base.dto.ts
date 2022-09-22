import { IsDateString, IsUUID } from "class-validator";

export class BaseDto {
  @IsUUID()
  id: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}
