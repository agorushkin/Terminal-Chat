import { parseFromString, Payload } from './payload.ts';
import { Validator } from '../validation/validator.ts';

import {
  HttpChallengePayloadValidator,
  HttpChannelCreatePayloadValidator,
  HttpLoginPayloadValidator,
  HttpMessagePayloadValidator,
  HttpPayloadType,
  HttpRegistrationPayloadValidator,
  HttpTokenPayloadValidator,
} from './httpPayloadTypes.ts';

const validators = new Map<string, Validator>([
  ['message', HttpMessagePayloadValidator],
  ['registration', HttpRegistrationPayloadValidator],
  ['login', HttpLoginPayloadValidator],
  ['token', HttpTokenPayloadValidator],
  ['challenge', HttpChallengePayloadValidator],
  ['channel-create', HttpChannelCreatePayloadValidator],
]);

export class HttpPayload extends Payload<HttpPayloadType> {
  static fromString = parseFromString<HttpPayloadType>(validators);
}
