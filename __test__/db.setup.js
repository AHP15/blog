import dotenv from 'dotenv';

import DB from '../models/index.js';

dotenv.config();

let signupResponses;
beforeAll(async () => {
  await DB.mongoose.connect(process.env.TEST_CONNECTION_URL, {
    dbName: 'blog',
  });
});

afterAll(async () => {
  await DB.mongoose.disconnect();
});

export default DB.mongoose.connection;