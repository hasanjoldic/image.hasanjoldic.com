import { DynamicModule, Global, Module } from "@nestjs/common";

import { AwsS3Service } from "./aws-s3.service";

@Global()
@Module({
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsS3Module {
  static register(): DynamicModule {
    return {
      module: AwsS3Module,
      providers: [AwsS3Service],
      exports: [AwsS3Service],
    };
  }
}
