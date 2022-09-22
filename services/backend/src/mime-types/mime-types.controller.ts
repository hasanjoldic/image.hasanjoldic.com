import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";

import { ValidatePayloadExistsPipe } from "src/common";

import { CreateMimeTypeDto } from "./dto/create-mime-type.dto";
import { MimeType } from "./dto/return-mime-type.dto";
import { UpdateMimeTypeDto } from "./dto/update-mime-type.dto";

import { MimeTypesService } from "./mime-types.service";

@ApiTags("Mime types")
@Controller("mime-types")
export class MimeTypesController {
  constructor(private readonly mimeTypesService: MimeTypesService) {}

  @ApiCreatedResponse({
    type: MimeType,
  })
  @Post()
  async create(@Body() createMimeTypeDto: CreateMimeTypeDto) {
    return this.mimeTypesService.create(createMimeTypeDto);
  }

  @Get()
  findAll() {
    return this.mimeTypesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.mimeTypesService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(ValidatePayloadExistsPipe) updateMimeTypeDto: UpdateMimeTypeDto
  ) {
    return this.mimeTypesService.update(id, updateMimeTypeDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.mimeTypesService.remove(id);
  }
}
