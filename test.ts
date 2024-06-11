import * as db from '/server/database.ts';

db.createChannelTable();
db.createUserTable();

db.createUser('admin', 'admin');
console.log(db.getUserKey('admin'));
console.log(db.checkUserExists('admin'));
console.log(db.getUserKey('test'));
