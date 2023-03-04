import mongoose from 'mongoose';

import User from './user.model.js';

const DB = {
  mongoose,
  user: User,
};

export default DB;
