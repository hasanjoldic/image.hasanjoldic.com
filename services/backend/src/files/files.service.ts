import { BadRequestException, Injectable } from "@nestjs/common";

import { NestPgPool, PgConnection } from "nest-pg";

import { findRows, insertRow, updateRow } from "src/common";
import {
  FileEntity,
  FileTagEntity,
  MimeTypeEntity,
  TagEntity,
} from "src/generated/db/entities";

import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import { AwsS3Service } from "src/aws-s3/aws-s3.service";

@Injectable()
export class FilesService {
  constructor(
    @PgConnection() private readonly db: NestPgPool,
    private readonly awsS3Service: AwsS3Service
  ) {}

  private async getFileNestedFields(fileId: string) {
    const mimeTypes = await this.db.rows<MimeTypeEntity>(
      `
        SELECT mime_type.*
        FROM mime_type
        JOIN file
        ON mime_type.id = file.mime_type_id
        WHERE file.id = $1;
      `,
      [fileId]
    );
    const tags = await this.db.rows<TagEntity>(
      `
        SELECT tag.*
        FROM tag
        JOIN file_tag
        ON tag.id = file_tag.tag_id
        WHERE file_tag.file_id = $1;
      `,
      [fileId]
    );

    return {
      tags,
      mimeType: mimeTypes[0],
    };
  }

  async create(
    createFileDto: CreateFileDto,
    // @ts-ignore
    file: Express.Multer.File
  ) {
    const hash = await this.awsS3Service.sha256HashAsHex(file.buffer);

    await this.awsS3Service.fileExists(hash);
    await this.awsS3Service.uploadFile(hash, file.buffer);

    const files = await insertRow<FileEntity>(
      this.db,
      "file",
      ["sha_256_hash", "mime_type_id", "is_private"],
      [hash, createFileDto.mimeTypeId, createFileDto.isPrivate]
    );

    const fileRow = files[0];

    const { mimeType, tags } = await this.getFileNestedFields(fileRow.id);

    return {
      ...fileRow,
      mimeType,
      tags,
    };
  }

  async checkByHash(hashes: string[]) {
    const filenames = await this.awsS3Service.listBucketContents();

    const notUploaded = hashes.filter((hash) => !filenames.includes(hash));

    return notUploaded;
  }

  async findAll({ sha256Hash }: { sha256Hash?: string }) {
    const files = await findRows<FileEntity>(this.db, "file", [
      { column: "sha_256_hash", value: sha256Hash },
    ]);

    const filesWithTags = await Promise.all(
      files.map(async (file) => {
        const { mimeType, tags } = await this.getFileNestedFields(file.id);

        return {
          ...file,
          mimeType,
          tags,
        };
      })
    );

    return {
      data: filesWithTags,
    };
  }

  async findOne(id: string) {
    const files = await findRows<FileEntity>(this.db, "file", [
      { column: "id", value: id },
    ]);
    const file = files[0];

    const { mimeType, tags } = await this.getFileNestedFields(file.id);

    return {
      ...file,
      mimeType,
      tags,
    };
  }

  async update(id: string, updateFileDto: UpdateFileDto) {
    const oldFileTags = await this.db.rows<FileTagEntity>(
      `
        SELECT *
        FROM file_tag
        WHERE file_id = $1
      `[id]
    );

    const createdFileTags = await Promise.all(
      updateFileDto.tagIds
        ?.filter(
          (newTagId) =>
            !oldFileTags.map((fileTag) => fileTag.tag_id).includes(newTagId)
        )
        .map((tagId) => {
          return this.db.rows<FileTagEntity>(
            `
              INSERT INTO file_tag (file_id, tag_id)
              VALUES ($1, $2)
              RETURNING *;
            `,
            [id, tagId]
          );
        })
    );

    const deletedFileTags = await Promise.all(
      oldFileTags
        .map((fileTag) => fileTag.tag_id)
        ?.filter((oldTagId) => !updateFileDto.tagIds.includes(oldTagId))
        .map((tagId) => {
          return this.db.rows<FileTagEntity>(
            `
              DELETE FROM file_tag
              WHERE
                file_id = $1
                  AND
                tag_id = $2
              RETURNING *;
            `,
            [id, tagId]
          );
        })
    );

    const files = await updateRow<FileEntity>(
      this.db,
      id,
      "file",
      ["sha_256_hash", "mime_type_id", "is_private"],
      [
        // updateFileDto.sha256Hash,
        updateFileDto.mimeTypeId,
        updateFileDto.isPrivate,
      ]
    );

    const file = files[0];

    const { mimeType, tags } = await this.getFileNestedFields(file.id);

    return {
      ...file,
      mimeType,
      tags,
    };
  }

  async remove(id: string) {
    const files = await this.db.rows<FileEntity>(
      `
        DELETE FROM file
        WHERE id = $1
        RETURNING *;
      `,
      [id]
    );

    return files[0].id;
  }
}
