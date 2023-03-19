import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import helmet from 'helmet';
import { cryptoRandomStringAsync } from 'crypto-random-string';

import userRouter from './routes/user.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately
// visit https://helmetjs.github.io/ for more info
app.use(helmet());
// Note: Disabling the X-Powered-By header does not prevent a sophisticated attacker from determining that an app is running Express
app.disable('x-powered-by');
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.redirect('home'));
app.get('/csrf-token', async (req, res) => {
  let token = await cryptoRandomStringAsync({length: 500});
  res.status(200).send({ token });
});
app.use(userRouter);

export default app;
