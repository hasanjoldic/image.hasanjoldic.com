import { IntersectionType } from "@nestjs/swagger";

import { BaseDto } from "src/common";

import { CreateMimeTypeDto } from "./create-mime-type.dto";

export class MimeType extends IntersectionType(BaseDto, CreateMimeTypeDto) {}
