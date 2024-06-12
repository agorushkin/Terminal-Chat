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
  db.query('INSERT INTO users (username, key) VALUES (:name, :key)', {
    name,
    key,
  });
};

export const checkUserExists = (name: string) => {
  const entry = db.query<[0 | 1]>(
    'SELECT EXISTS(SELECT 1 FROM users WHERE username = :name)',
    { name },
  );

  return entry?.[0]?.[0] === 1;
};

export const getUserToken = (name: string) => {
  const entry = db.query<[string | null]>(
    'SELECT token FROM users WHERE username = :name',
    { name },
  );

  return entry.length === 0 ? null : entry?.[0]?.[0];
};

export const getUserByToken = (token: string) => {
  const entry = db.query<[string]>(
    'SELECT username FROM users WHERE token = :token',
    { token },
  );

  return entry.length === 0 ? null : entry?.[0]?.[0];
};

export const setUserToken = (name: string, token: string) => {
  db.query('UPDATE users SET token = :token WHERE username = :name', {
    name,
    token,
  });
};

export const getUserKey = (name: string) => {
  const entry = db.query<[string]>(
    'SELECT key FROM users WHERE username = :name',
    { name },
  );

  return entry.length === 0 ? null : entry?.[0]?.[0];
};

export const getUserChannels = (name: string) => {
  const entry = db.query<[string | null]>(
    'SELECT channels FROM users WHERE username = :name',
    { name },
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
  db.query(
    'INSERT INTO channel (name, owner, users) VALUES (:channel, :owner, :owner)',
    {
      channel,
      owner,
    },
  );
};

export const checkChannelExists = (channel: string) => {
  const entry = db.query<[0 | 1]>(
    'SELECT EXISTS(SELECT 1 FROM channel WHERE name = :channel)',
    { channel },
  );

  return entry.length === 0 ? null : entry?.[0]?.[0];
};

export const getChannelName = (channel: string) => {
  const entry = db.query<[string]>(
    'SELECT name FROM channel WHERE name = :channel',
    { channel },
  );

  return entry.length === 0 ? null : entry?.[0]?.[0];
};

export const getChannelUsers = (channel: string) => {
  const entry = db.query<[string]>(
    'SELECT users FROM channel WHERE name = :channel',
    { channel },
  );

  return entry.length === 0
    ? null
    : entry?.[0]?.[0].split(',').filter((c) => c.length);
};

export const getChannelOwner = (channel: string) => {
  const entry = db.query<[string]>(
    'SELECT owner FROM channel WHERE name = :channel',
    { channel },
  );

  return entry.length === 0 ? null : entry?.[0]?.[0];
};

export const checkUserInChannel = (channel: string, user: string) => {
  const entry = db.query<[0 | 1]>(
    'SELECT EXISTS(SELECT 1 FROM channel WHERE name = :channel AND users LIKE :user)',
    {
      channel,
      user: `%${user}%`,
    },
  );

  return entry?.[0]?.[0] === 1;
};

export const addUserToChannel = (channel: string, user: string) => {
  db.query(
    'UPDATE channel SET users = users || :user WHERE name = :channel',
    { channel, user: `,${user}` },
  );
  db.query(
    'UPDATE users SET channels = channels || :channel WHERE username = :user',
    { channel: `,${channel}`, user },
  );
};

export const removeUserFromChannel = (channel: string, user: string) => {
  db.query(
    "UPDATE channel SET users = REPLACE(users, :user, '') WHERE name = :channel",
    { channel, user: `,${user}` },
  );
  db.query(
    "UPDATE users SET channels = REPLACE(channels, :channel, '') WHERE username = :user",
    { channel: `,${channel}`, user },
  );
};
