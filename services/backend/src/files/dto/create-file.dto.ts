import { IsBoolean, IsOptional, IsUUID } from "class-validator";

import { OmitDefaultDBColumns } from "src/utils";

import { ICreateFileDto } from "src/generated/db/dto/createDto";

export class CreateFileDto
  implements Omit<OmitDefaultDBColumns<ICreateFileDto>, "sha256Hash">
{
  // @MinLength(64)
  // @IsString()
  // sha256Hash: string;

  // @IsNotEmpty()
  // file: string;

  @IsUUID()
  mimeTypeId: string;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @IsUUID("all", { each: true })
  @IsOptional()
  tagIds?: string[];
}
