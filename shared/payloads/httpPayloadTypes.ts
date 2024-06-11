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

export type HttpPayloadType =
  | HttpMessagePayload
  | HttpRegistrationPayload
  | HttpLoginPayload;
