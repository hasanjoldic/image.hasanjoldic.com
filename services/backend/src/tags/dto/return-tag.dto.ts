import { IntersectionType } from "@nestjs/swagger";

import { BaseDto } from "src/common";

import { CreateTagDto } from "./create-tag.dto";

export class Tag extends IntersectionType(BaseDto, CreateTagDto) {}
