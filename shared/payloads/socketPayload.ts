import { parseFromString, Payload } from './payload.ts';
import { Validator } from '../validation/validator.ts';

import {
  SocketAuthPayloadValidator,
  SocketHeartbeatPayloadValidator,
  SocketMessagePayloadValidator,
  SocketPayloadType,
} from '/shared/payloads/socketPayloadTypes.ts';

const validators = new Map<string, Validator>([
  ['heartbeat', SocketHeartbeatPayloadValidator],
  ['message', SocketMessagePayloadValidator],
  ['auth', SocketAuthPayloadValidator],
]);

export class SocketPayload extends Payload<SocketPayloadType> {
  static fromString = parseFromString<SocketPayloadType>(validators);
}
