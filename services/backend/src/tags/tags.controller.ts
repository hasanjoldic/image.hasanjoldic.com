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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { ValidatePayloadExistsPipe } from "src/common";

import { CreateTagDto } from "./dto/create-tag.dto";
import { Tag } from "./dto/return-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";

import { TagsService } from "./tags.service";

@ApiTags("Tags")
@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiCreatedResponse({
    type: Tag,
  })
  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @ApiOkResponse({
    type: Tag,
  })
  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @ApiOkResponse({
    type: Tag,
  })
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.tagsService.findOne(id);
  }

  @ApiOkResponse({
    type: Tag,
  })
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(ValidatePayloadExistsPipe) updateTagDto: UpdateTagDto
  ) {
    return this.tagsService.update(id, updateTagDto);
  }

  @ApiOkResponse({
    type: Tag,
  })
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.tagsService.remove(id);
  }
}
