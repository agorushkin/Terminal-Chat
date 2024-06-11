import { isString } from '../validation/rules.ts';

export type HttpMessagePayload = {
  type: 'message';
  content: string;
};
export const HttpMessagePayloadValidator = {
  type: 'message',
  content: isString,
};

// Registration Payload

export type HttpRegistrationPayload = {
  type: 'registration';
  username: string;
  key: string;
};

export const HttpRegistrationPayloadValidator = {
  type: 'registration',
  username: isString,
  key: isString,
};

// Login Payload

export type HttpLoginPayload = {
  type: 'login';
  username: string;
  signature: string;
  challenge: string;
};

export const HttpLoginPayloadValidator = {
  type: 'login',
  username: isString,
  signature: isString,
  challenge: isString,
};

// Token Payload

export type HttpTokenPayload = {
  type: 'token';
  token: string;
};
export const HttpTokenPayloadValidator = {
  type: 'token',
  token: isString,
};

// Challenge Payload

export type HttpChallengePayload = {
  type: 'challenge';
  challenge: string;
};
export const HttpChallengePayloadValidator = {
  type: 'challenge',
  challenge: isString,
};

// Channel Create Payload

export type HttpChannelCreatePayload = {
  type: 'channel-create';
  name: string;
};
export const HttpChannelCreatePayloadValidator = {
  type: 'channel-create',
  name: isString,
};

export type HttpPayloadType =
  | HttpMessagePayload
  | HttpRegistrationPayload
  | HttpLoginPayload
  | HttpTokenPayload
  | HttpChallengePayload
  | HttpChannelCreatePayload;
