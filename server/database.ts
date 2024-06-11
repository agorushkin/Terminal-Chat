import { DB } from 'x/sqlite';

const db = new DB('./data/db.sqlite3');

export type USER_ROW = [number, string, string | null, string];

export type CHANNEL_ROW = [number, string, string, string];

export const createUserTable = () => {
  db.execute(`
  CREATE TABLE IF NOT EXISTS users (
    username TEXT NOT NULL PRIMARY KEY,
    channels TEXT,
    token TEXT,
    updated INTEGER,
    key TEXT NOT NULL
  )
`);
};

export const createUser = (name: string, key: string) => {
  db.execute(`INSERT INTO users (username, key) VALUES ('${name}', '${key}')`);
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

  return entry.length === 0 ? null : entry?.[0]?.[0];
};

export const getUserByToken = (token: string) => {
  const entry = db.query<[string]>(
    `SELECT username FROM users WHERE token = '${token}'`,
  );

  return entry.length === 0 ? null : entry?.[0]?.[0];
};

export const setUserToken = (user: string, token: string) => {
  db.execute(`UPDATE users SET token = '${token}' WHERE username = '${user}'`);
};

export const getUserKey = (user: string) => {
  const entry = db.query<[string]>(
    `SELECT key FROM users WHERE username = '${user}'`,
  );

  return entry.length === 0 ? null : entry?.[0]?.[0];
};

export const getUserChannels = (user: string) => {
  const entry = db.query<[string | null]>(
    `SELECT channels FROM users WHERE username = '${user}'`,
  );

  return entry.length === 0
    ? null
    : entry?.[0]?.[0]?.split(',').filter((c) => c.length);
};

export const createChannelTable = () => {
  db.execute(`
  CREATE TABLE IF NOT EXISTS channel (
    name TEXT NOT NULL PRIMARY KEY,
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

  return entry.length === 0 ? null : entry?.[0]?.[0];
};

export const getChannelName = (channel: string) => {
  const entry = db.query<[string]>(
    `SELECT name FROM channel WHERE name = '${channel}'`,
  );

  return entry.length === 0 ? null : entry?.[0]?.[0];
};

export const getChannelUsers = (channel: string) => {
  const entry = db.query<[string]>(
    `SELECT users FROM channel WHERE name = '${channel}'`,
  );

  return entry.length === 0
    ? null
    : entry?.[0]?.[0].split(',').filter((c) => c.length);
};

export const getChannelOwner = (channel: string) => {
  const entry = db.query<[string]>(
    `SELECT owner FROM channel WHERE name = '${channel}'`,
  );

  return entry.length === 0 ? null : entry?.[0]?.[0];
};

export const checkUserInChannel = (channel: string, user: string) => {
  const entry = db.query<[0 | 1]>(
    `SELECT EXISTS(SELECT 1 FROM channel WHERE name = '${channel}' AND users LIKE '%${user}%')`,
  );

  return entry?.[0]?.[0] === 1;
};

export const addUserToChannel = (channel: string, user: string) => {
  db.execute(
    `UPDATE channel SET users = users || ',${user}' WHERE name = '${channel}'`,
  );
  db.execute(
    `UPDATE users SET channels = channels || ',${channel}' WHERE username = '${user}'`,
  );
};

export const removeUserFromChannel = (channel: string, user: string) => {
  db.execute(
    `UPDATE channel SET users = REPLACE(users, '${user}', '') WHERE name = '${channel}'`,
  );
  db.execute(
    `UPDATE users SET channels = REPLACE(channels, '${channel}', '') WHERE username = '${user}'`,
  );
};
