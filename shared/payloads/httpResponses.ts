export const HttpResponses = {
  OK: { status: 200, body: 'ok' },
  BAD_REQUEST: { status: 400, body: 'bad-request' },
  INVALID_LOGIN_REQUEST: { status: 400, body: 'invalid-login-request' },
  INVALID_SIGNATURE: { status: 400, body: 'invalid-signature' },
  UNAUTHORIZED: { status: 401, body: 'unauthorized' },

  CHANNEL_NOT_FOUND: { status: 404, body: 'channel-not-found' },
  CHANNEL_NAME_EXISTS: { status: 409, body: 'channel-name-exists' },

  USER_NOT_FOUND: { status: 404, body: 'user-not-found' },
  USER_NOT_IN_CHANNEL: { status: 404, body: 'user-not-in-channel' },
  USER_EXISTS: { status: 409, body: 'user-exists' },
  USER_ALREADY_IN_CHANNEL: { status: 409, body: 'user-already-in-channel' },
};
