import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { NestPgModule } from "nest-pg";

@Module({
  imports: [
    NestPgModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        host: configService.get<string>("POSTGRES_HOST"),
        port: parseInt(configService.get<string>("POSTGRES_PORT")),
        user: configService.get<string>("POSTGRES_USER"),
        password: configService.get<string>("POSTGRES_PASSWORD"),
        database: configService.get<string>("POSTGRES_DB"),
      }),
    }),
  ],
})
export class DatabaseModule {}
