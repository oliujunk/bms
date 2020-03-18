import Datastore from 'nedb';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { remote } from 'electron';

const db = {
  message: new Datastore({
    filename: path.join(remote.app.getPath('userData'), 'db/message.db'),
    autoload: true,
  }),
  user: new Datastore({
    filename: path.join(remote.app.getPath('userData'), 'db/user.db'),
    autoload: true,
  }),
  program: new Datastore({
    filename: path.join(remote.app.getPath('userData'), 'db/program.db'),
    autoload: true,
  }),
};

export default db;
