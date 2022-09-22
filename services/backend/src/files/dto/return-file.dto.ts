import { IntersectionType } from "@nestjs/swagger";

import { BaseDto } from "src/common";

import { CreateFileDto } from "./create-file.dto";

export class File extends IntersectionType(BaseDto, CreateFileDto) {}
