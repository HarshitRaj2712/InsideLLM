import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { corsOptions } from './config/cors.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';

const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

app.get('/api', (_req, res) => {
  res.json({ success: true, message: 'API is ready' });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;