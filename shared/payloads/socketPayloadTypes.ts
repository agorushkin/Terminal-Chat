import { isString } from '../validation/rules.ts';

// Heartbeat Payload

export type SocketHeartbeatPayload = {
  type: 'heartbeat';
};
export const SocketHeartbeatPayloadValidator = {
  type: 'heartbeat',
};

// Message Payload

export type SocketMessagePayload = {
  type: 'message';
  content: string;
  author: string;
};
export const SocketMessagePayloadValidator = {
  type: 'message',
  content: isString,
  author: isString,
};

// Auth Payload

export type SocketAuthPayload = {
  type: 'auth';
  token: string;
};

export const SocketAuthPayloadValidator = {
  type: 'auth',
  token: isString,
};

export type SocketPayloadType =
  | SocketHeartbeatPayload
  | SocketMessagePayload
  | SocketAuthPayload;
