import dotenv from 'dotenv';
dotenv.config({ path: `./config/.${process.env.NODE_ENV}.env` });

import createApp from './app';
import connectDB from './database/connectDB';

connectDB(process.env.MONGO_URI || '');

const app = createApp();

app.listen();
