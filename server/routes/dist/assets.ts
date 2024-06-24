import { Handler } from 'x/http';
import { HttpResponses } from '/shared/payloads/httpResponses.ts';
import { HttpPayload } from '/shared/payloads/httpPayload.ts';
import { SocketPayload } from '/shared/payloads/socketPayload.ts';

import { checkChannelExists, getUserByToken } from '/server/database.ts';
import { broadcaster } from '/server/main.ts';

export const : Handler = async (request): Promise<void> => {

};
