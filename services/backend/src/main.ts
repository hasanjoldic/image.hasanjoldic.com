import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { AppModule } from "./app.module";

import { JwtAuthGuard, UnauthorizedExceptionFilter } from "./common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: true });

  if (process.env.NODE_ENV === "development") {
    app.enableCors();
  }

  if (process.env.NODE_ENV !== "development") {
    app.useGlobalGuards(new JwtAuthGuard());
  }

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new UnauthorizedExceptionFilter());

  app.setGlobalPrefix("/api");
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1"],
  });

  const config = new DocumentBuilder()
    .setTitle("images.hasanjoldic.com API")
    .setDescription("Track images by two data points: hash and tags")
    .setVersion("v1")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);

  printAllRoutes(app);
}

bootstrap();

function printAllRoutes(app: INestApplication) {
  const server = app.getHttpServer();
  const router = server._events.request._router;

  const availableRoutes: [] = router.stack
    .map((layer) => {
      if (layer.route) {
        return {
          route: {
            path: layer.route?.path,
            method: layer.route?.stack[0].method,
          },
        };
      }
    })
    .filter((item) => item !== undefined);
  console.log(availableRoutes);
}
