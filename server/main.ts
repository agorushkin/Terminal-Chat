import { Server, ServerBrodcaster } from 'x/http';

import { createChannelTable, createUserTable } from '/server/database.ts';

import { enableCors } from '/server/routes/cors.ts';
import { checkAuthorization } from '/server/routes/authorize.ts';
import { handleWebsocketConnection } from '/server/routes/connect.ts';

import { channelRouter } from '/server/routes/channel/router.ts';
import { authRouter } from '/server/routes/auth/router.ts';

export const server = new Server();
export const broadcaster = new ServerBrodcaster();
export const connections = new Map<string, WebSocket>();

createUserTable();
createChannelTable();

server.use(enableCors);
server.use(checkAuthorization);
server.use(...channelRouter, ...authRouter);

server.get('/connect', handleWebsocketConnection);

server.use(({ response, responded, href }) =>
  console.log(href, response, responded)
);

server.listen(8080);
