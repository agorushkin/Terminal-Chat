import { Handler } from 'x/http';

export const enableCors: Handler = (
  { response },
): void => {
  response.headers = new Headers([
    ['Access-Control-Allow-Origin', '*'],
    ['Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'],
    ['Access-Control-Allow-Headers', 'Content-Type'],
    ['Access-Control-Max-Age', '86400'],
  ]);
};
