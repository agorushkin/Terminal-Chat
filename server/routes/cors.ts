import { Handler } from 'x/http';
import { HttpResponses } from '/shared/payloads/httpResponses.ts';

export const enableCors: Handler = (request) => {
  const response = request.response;
  const headers = response.headers;

  headers.append('Access-Control-Allow-Origin', '*');
  headers.append(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  headers.append('Access-Control-Max-Age', '86400');

  if (request.method === 'OPTIONS') {
    response.status = HttpResponses.OK.status;
    response.body = HttpResponses.OK.body;
    console.log(response);
    request.respond();
    return;
  } else {
    headers.append(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );
  }
};
