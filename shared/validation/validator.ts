import { match } from '/shared/match.ts';

export type ValidatorFunction = (
  data: unknown,
) => unknown | null;

export type Validator = {
  [key: string]:
    | Validator
    | ValidatorFunction
    | string
    | number
    | boolean;
};

const validateFunction = (data: unknown, validator: ValidatorFunction) => {
  console.log('meow', data, validator);
  const validated = validator(data);
  if (validated === undefined) return null;
  return validated;
};

export const validate = <T extends Record<string, unknown>>(
  data: Record<string, unknown>,
  validator: Validator,
): T | null => {
  const parsed = {} as Record<string, unknown>;

  if (
    typeof data !== 'object' ||
    data instanceof Array ||
    data === null
  ) return null;

  for (const key in validator) {
    if (data[key] === undefined) return null;

    const check = validator[key];
    const type = typeof check;
    const value = data[key];

    const returned = match(type, {
      'function': () => validateFunction(value, check as ValidatorFunction),
      'object': () =>
        validate(value as Record<string, unknown>, check as Validator),
      'string': () => value === check ? value : null,
      'number': () => value === check ? value : null,
      'boolean': () => value === check ? value : null,
      'bigint': () => null,
      'symbol': () => null,
      'undefined': () => null,
      '_': () => null,
    });

    if (returned === null) return null;
    parsed[key] = returned;
  }

  return parsed as T;
};
