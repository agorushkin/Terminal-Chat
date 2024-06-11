const map = new Map<unknown, [number, unknown]>();

export const cache = <T>(id: string, call: () => T): T => {
  if (!map.has(id)) {
    const value = call();
    map.set(id, [Date.now() + 1000 * 60, value]);
  }

  const [expires, value] = map.get(id)!;

  if (Date.now() > expires) {
    const newValue = call();
    map.set(id, [Date.now() + 1000 * 60, newValue]);
    return newValue;
  } else return value as T;
};
