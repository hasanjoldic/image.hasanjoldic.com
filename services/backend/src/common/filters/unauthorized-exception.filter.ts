import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from "@nestjs/common";
import { Response } from "express";

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(_, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log("UnauthorizedExceptionFilter");

    response.redirect(
      302,
      "https://auth.hasanjoldic.com?from=https://images.hasanjoldic.com"
    );
  }
}
