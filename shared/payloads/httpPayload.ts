import { parseFromString, Payload } from './payload.ts';
import { Validator } from '../validation/validator.ts';

import {
  HttpLoginPayloadValidator,
  HttpMessagePayloadValidator,
  HttpPayloadType,
  HttpRegistrationPayloadValidator,
} from './httpPayloadTypes.ts';

const validators = new Map<string, Validator>([
  ['message', HttpMessagePayloadValidator],
  ['registration', HttpRegistrationPayloadValidator],
  ['login', HttpLoginPayloadValidator],
]);

export class HttpPayload extends Payload<HttpPayloadType> {
  static fromString = parseFromString<HttpPayloadType>(validators);
}
