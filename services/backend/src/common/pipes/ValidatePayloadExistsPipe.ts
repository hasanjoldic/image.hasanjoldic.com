import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

Injectable();
export class ValidatePayloadExistsPipe<T> implements PipeTransform {
  transform(payload: T): T {
    if (!Object.keys(payload).length) {
      throw new BadRequestException("Payload should not be empty");
    }

    return payload;
  }
}
