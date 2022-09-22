import { Module } from "@nestjs/common";

import { MimeTypesController } from "./mime-types.controller";
import { MimeTypesService } from "./mime-types.service";

@Module({
  controllers: [MimeTypesController],
  providers: [MimeTypesService],
})
export class MimeTypesModule {}
