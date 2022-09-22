import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseArrayPipe,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";

import { ValidatePayloadExistsPipe } from "src/common";

import { CreateFileDto } from "./dto/create-file.dto";
import { File } from "./dto/return-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";

import { FilesService } from "./files.service";

@ApiTags("Files")
@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post("check-by-hash")
  checkByHash(@Body("hashes") hashes: string[]) {
    return this.filesService.checkByHash(hashes);
  }

  @ApiCreatedResponse({
    type: File,
  })
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async create(
    @Body() createFileDto: CreateFileDto,
    // @ts-ignore
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log({ file });
    return this.filesService.create(createFileDto, file);
  }

  @Get()
  findAll(@Query("sha256Hash") sha256Hash: string) {
    return this.filesService.findAll({ sha256Hash });
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.filesService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(ValidatePayloadExistsPipe) updateFileDto: UpdateFileDto
  ) {
    return this.filesService.update(id, updateFileDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.filesService.remove(id);
  }
}
