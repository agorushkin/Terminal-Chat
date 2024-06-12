import { serve, Server } from 'x/http';

const server = new Server();

server.get('/*', serve('./'));

server.listen(3000);
