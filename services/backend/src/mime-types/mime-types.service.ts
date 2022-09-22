import { Injectable } from "@nestjs/common";

import { NestPgPool, PgConnection } from "nest-pg";

import { updateRow } from "src/common";
import { MimeTypeEntity } from "src/generated/db/entities";

import { CreateMimeTypeDto } from "./dto/create-mime-type.dto";
import { UpdateMimeTypeDto } from "./dto/update-mime-type.dto";

@Injectable()
export class MimeTypesService {
  constructor(@PgConnection() private readonly db: NestPgPool) {}

  async create(createMimeTypeDto: CreateMimeTypeDto) {
    const mimeTypes = await this.db.rows<MimeTypeEntity>(
      `
        INSERT INTO mime_type (value, ext)
        VALUES ($1, $2)
        RETURNING *;
      `,
      [createMimeTypeDto.value, createMimeTypeDto.ext]
    );

    return {
      data: mimeTypes[0],
    };
  }

  async findAll() {
    const mimeTypes = await this.db.rows<MimeTypeEntity>(
      `SELECT * FROM mime_type;`
    );

    return {
      data: mimeTypes,
    };
  }

  async findOne(id: string) {
    const mimeTypes = await this.db.rows<MimeTypeEntity>(
      `SELECT * FROM mime_type WHERE id = $1;`,
      [id]
    );

    return {
      data: mimeTypes[0],
    };
  }

  async update(id: string, updateMimeTypeDto: UpdateMimeTypeDto) {
    const mimeTypes = await updateRow(
      this.db,
      id,
      "mime_type",
      ["value", "ext"],
      [updateMimeTypeDto.value, updateMimeTypeDto.ext]
    );

    return {
      data: mimeTypes[0],
    };
  }

  async remove(id: string) {
    const mimeTypes = await this.db.rows<MimeTypeEntity>(
      `
        DELETE FROM mime_type
        WHERE id = $1
        RETURNING *;
      `,
      [id]
    );

    return {
      data: mimeTypes[0],
    };
  }
}
