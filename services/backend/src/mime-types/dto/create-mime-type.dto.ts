import { IsMimeType, IsString } from "class-validator";

import { OmitDefaultDBColumns } from "src/utils";

import { ICreateMimeTypeDto } from "src/generated/db/dto/createDto";

export class CreateMimeTypeDto
  implements OmitDefaultDBColumns<ICreateMimeTypeDto>
{
  @IsMimeType()
  value: string;

  @IsString()
  ext: string;
}
