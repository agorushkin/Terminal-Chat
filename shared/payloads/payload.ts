import { validate, Validator } from '../validation/validator.ts';

export class Payload<T extends Record<string, unknown> & { type: string }> {
  data: T;

  constructor(data: { [K in keyof T]: T[K] }) {
    this.data = data;
  }

  toString = (): string => {
    return JSON.stringify(this.data);
  };
}

export const parseFromString = <T>(
  validators: Map<string, Validator>,
): <K extends T>(json: string) => K | null => {
  return <T>(
    json: string,
  ): T | null => {
    try {
      const data = JSON.parse(json);

      if (
        !data.type ||
        typeof data.type !== 'string'
      ) return null;

      const validator = validators.get(data.type);
      if (!validator) return null;

      const payload = validate(data, validator);
      if (!payload) return null;

      return payload as T;
    } catch {
      return null;
    }
  };
};
