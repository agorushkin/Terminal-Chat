import { db } from '/server/main.ts';

export type USER_ROW = [string, string | null, string];

export type CHANNEL_ROW = [string, string, string | null, string];

export const createUserTable = () => {
  db.execute(`
  CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    token TEXT,
    key TEXT NOT NULL
  )
`);
};

export const createUser = (user: string, key: string) => {
  db.execute(`INSERT INTO users (username, key) VALUES ('${user}', '${key}')`);
};

export const checkUserExists = (user: string) => {
  const entry = db.query<[0 | 1]>(
    `SELECT EXISTS(SELECT 1 FROM users WHERE username = '${user}')`,
  );

  return entry?.[0]?.[0] === 1;
};

export const getUserToken = (user: string) => {
  const entry = db.query<[string | null]>(
    `SELECT token FROM users WHERE username = '${user}'`,
  );

  return entry?.[0]?.[0];
};

export const getUserByToken = (token: string) => {
  const entry = db.query<[string]>(
    `SELECT username FROM users WHERE token = '${token}'`,
  );

  return entry?.[0]?.[0];
};

export const setUserToken = (user: string, token: string) => {
  db.execute(`UPDATE users SET token = '${token}' WHERE username = '${user}'`);
};

export const getUserKey = (user: string) => {
  const entry = db.query<[string]>(
    `SELECT key FROM users WHERE username = '${user}'`,
  );

  return entry?.[0]?.[0];
};

export const createChannelTable = () => {
  db.execute(`
  CREATE TABLE IF NOT EXISTS channel (
    name TEXT PRIMARY KEY,
    owner TEXT NOT NULL,
    users TEXT NOT NULL,

    FOREIGN KEY(owner) REFERENCES users(username)
  )
`);
};

export const createChannel = (
  channel: string,
  owner: string,
) => {
  db.execute(
    `INSERT INTO channel (name, owner, users) VALUES ('${channel}', '${owner}', '${owner}')`,
  );
};

export const checkChannelExists = (channel: string) => {
  const entry = db.query<[0 | 1]>(
    `SELECT EXISTS(SELECT 1 FROM channel WHERE name = '${channel}')`,
  );

  return entry?.[0]?.[0] === 1;
};

export const getChannelUsers = (channel: string) => {
  const entry = db.query<[string]>(
    `SELECT users FROM channel WHERE name = '${channel}'`,
  );

  return entry?.[0]?.[0].split(',');
};

export const getChannelOwner = (channel: string) => {
  const entry = db.query<[string]>(
    `SELECT owner FROM channel WHERE name = '${channel}'`,
  );

  return entry?.[0]?.[0];
};

export const ADD_USER_TO_CHANNEL = (channel: string, user: string) => `
  UPDATE channel SET users = users || ',${user}' WHERE name = '${channel}'
`;

export const addUserToChannel = (channel: string, user: string) => {
  db.execute(
    `UPDATE channel SET users = users || ',${user}' WHERE name = '${channel}'`,
  );
};

export const removeUserFromChannel = (channel: string, user: string) => {
  db.execute(
    `UPDATE channel SET users = REPLACE(users, '${user}', '') WHERE name = '${channel}'`,
  );
};

export const deleteChannel = (channel: string) => {
  db.execute(`DELETE FROM channel WHERE name = '${channel}'`);
};
