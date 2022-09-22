import { IsOptional, IsString, IsUUID } from "class-validator";

import { OmitDefaultDBColumns } from "src/utils";

import { ICreateTagDto } from "src/generated/db/dto/createDto";

export class CreateTagDto implements OmitDefaultDBColumns<ICreateTagDto> {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  parentId?: string;
}
