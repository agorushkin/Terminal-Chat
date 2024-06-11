import { ServerRouter } from 'x/http';

import { joinChannel } from '/server/routes/channel/join.ts';
import { leaveChannel } from '/server/routes/channel/leave.ts';
import { createNewChannel } from '/server/routes/channel/create.ts';
import { sendMessage } from '/server/routes/channel/send.ts';

export const channelRouter = new ServerRouter('/channel');

channelRouter.post('/create', createNewChannel);
channelRouter.post('/join/:channel', joinChannel);
channelRouter.post('/leave/:channel', leaveChannel);
channelRouter.post('/message/:channel', sendMessage);
