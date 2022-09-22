import { PartialType } from "@nestjs/swagger";

import { CreateMimeTypeDto } from "./create-mime-type.dto";

export class UpdateMimeTypeDto extends PartialType(CreateMimeTypeDto) {}
