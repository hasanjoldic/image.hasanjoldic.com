import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DatabaseModule } from "./database/database.module";

import { TagsModule } from "./tags/tags.module";
import { MimeTypesModule } from "./mime-types/mime-types.module";
import { FilesModule } from "./files/files.module";
import { JwtStrategy } from "./auth/jwt.strategy";
import { AwsS3Module } from "./aws-s3";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: "../../.env",
      isGlobal: true,
    }),

    DatabaseModule,
    AwsS3Module,

    TagsModule,
    MimeTypesModule,
    FilesModule,
  ],

  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
