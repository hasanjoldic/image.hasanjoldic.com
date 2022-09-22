import { createHash } from "crypto";

import { BadRequestException, Injectable } from "@nestjs/common";

import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  HeadObjectCommand,
  ErrorDocument,
  NotFound,
} from "@aws-sdk/client-s3";

@Injectable()
export class AwsS3Service {
  private readonly s3Client: S3Client;
  private readonly uploadFileParams = {
    Bucket: process.env.DO_SPACES_BUCKET, // The path to the directory you want to upload the object to, starting with your Space name.
    // Key: process.env.DO_SPACES_DIR, // Object key, referenced whenever you want to access this file later.
    // Body: "Hello, World!", // The object's contents. This variable is an object, not a string.
    ACL: "public-read", // Defines ACL permissions, such as private or public.
    Metadata: {
      // Defines metadata tags.
      // "x-amz-meta-my-key": "your-value",
    },
  };

  constructor() {
    this.s3Client = new S3Client({
      endpoint: process.env.DO_SPACES_ENDPOINT, // Find your endpoint in the control panel, under Settings. Prepend "https://".
      region: process.env.DO_SPACES_REGION, // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
      credentials: {
        accessKeyId: process.env.DO_SPACES_ACCESS_KEY_ID, // Access key pair. You can create access key pairs using the control panel or API.
        secretAccessKey: process.env.DO_SPACES_SECRET_ACCESS_KEY, // Secret access key defined through an environment variable.
      },
    });
  }

  async uploadFile(filename: string, body: Buffer) {
    this.s3Client.send(
      new PutObjectCommand({
        ...this.uploadFileParams,
        Key: [process.env.DO_SPACES_DIR, filename].join("/"),
        Body: body,
      })
    );
  }

  async listBucketContents() {
    const prefix = `${process.env.DO_SPACES_DIR}/`;
    const filenames: string[] = [];
    // Declare truncated as a flag that the while loop is based on.
    let truncated = true;

    // Declare a variable to which the key of the last element is assigned to in the response.
    let pageMarker: string;

    // while loop that runs until 'response.truncated' is false.
    while (truncated) {
      const response = await this.s3Client.send(
        new ListObjectsCommand({
          Bucket: process.env.DO_SPACES_BUCKET,
          Prefix: prefix,
          Marker: pageMarker,
        })
      );

      filenames.push(...response.Contents.map((item) => item.Key));

      // Log the key of every item in the response to standard output.
      truncated = response.IsTruncated;

      // If truncated is true, assign the key of the last element in the response to the pageMarker variable.
      if (truncated) {
        pageMarker = response.Contents.slice(-1)[0].Key;
      }

      // At end of the list, response.truncated is false, and the function exits the while loop.
    }

    return filenames
      .map((filename) => filename.slice(prefix.length))
      .filter((o) => o);
  }

  async fileExists(filename: string) {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET,
          Key: [process.env.DO_SPACES_DIR, filename].join("/"),
        })
      );

      throw new BadRequestException("File already exist");
    } catch (error: unknown) {
      const notFoundException = error as NotFound;
      if (notFoundException.name === "NotFound") {
        return false;
      }

      throw new BadRequestException("File already exist");
    }
  }

  async sha256HashAsHex(buffer: Buffer) {
    return createHash("sha256").update(buffer).digest("hex");
  }
}
