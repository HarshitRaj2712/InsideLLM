import { env } from './env.js';

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || env.CLIENT_ORIGIN.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked origin: ${origin}`));
    }
  },

  credentials: true,
};