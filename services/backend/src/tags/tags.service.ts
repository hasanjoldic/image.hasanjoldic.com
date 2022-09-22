import { Injectable } from "@nestjs/common";

import { NestPgPool, PgConnection } from "nest-pg";

import { updateRow } from "src/common";
import { TagEntity } from "src/generated/db/entities";

import { CreateTagDto } from "./dto/create-tag.dto";
import { Tag } from "./dto/return-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";

@Injectable()
export class TagsService {
  constructor(@PgConnection() private readonly db: NestPgPool) {}

  async create(createTagDto: CreateTagDto): Promise<{ data: Tag }> {
    const tags = await this.db.rows<TagEntity>(
      `
        INSERT INTO tag (title, description, parent_id)
        VALUES ($1, $2, $3)
        RETURNING *;
      `,
      [createTagDto.title, createTagDto.description, createTagDto.parentId]
    );

    return {
      data: tags[0] as unknown as Tag,
    };
  }

  async findAll() {
    const tags = await this.db.rows<TagEntity>(`SELECT * FROM tag;`);

    return {
      data: tags,
    };
  }

  async findOne(id: string) {
    const tags = await this.db.rows<TagEntity>(
      `SELECT * FROM tag WHERE id = $1;`,
      [id]
    );

    return {
      data: tags[0],
    };
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tags = await updateRow(
      this.db,
      id,
      "tag",
      ["title", "description", "parent_id"],
      [updateTagDto.title, updateTagDto.description, updateTagDto.parentId]
    );

    return {
      data: tags[0],
    };
  }

  async remove(id: string) {
    const tags = await this.db.rows<TagEntity>(
      `
        DELETE FROM tag
        WHERE id = $1
        RETURNING *;
      `,
      [id]
    );

    return {
      data: tags[0],
    };
  }
}
