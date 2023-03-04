import dotenv from 'dotenv';

import app from './app.js';
import DB from './models/index.js';

dotenv.config();

DB.mongoose.connect(process.env.CONNECTION_URL)
  .then(() => console.log('DB connected seccussfully'))
  .catch(console.log);

const port = process.env.PORT ?? 8080;
app.listen(port, () => {
  console.log('Server listening on port', port);
});
