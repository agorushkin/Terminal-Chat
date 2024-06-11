import { Server, ServerBrodcaster } from 'x/http';
import { DB } from 'x/sqlite';

import * as SQL from './database.ts';

import { checkAuthorization } from '/server/routes/authorize.ts';
import { handleWebsocketConnection } from '/server/routes/connect.ts';
import { sendMessage } from '/server/routes/post/sendMessage.ts';

export const server = new Server();
export const broadcaster = new ServerBrodcaster();

export const db = new DB('./data/current.db');

server.get('/connect', handleWebsocketConnection);
server.get('/*', checkAuthorization);
server.post('/message/:channel', sendMessage);

server.listen(8080);
