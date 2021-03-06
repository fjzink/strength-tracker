import express from 'express';
import cors from 'cors';
import { Db, MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
import { trainingSplitRouter } from './controllers/trainingSplitController';
import { authRouter } from './controllers/authController';
import { dbClient } from './config/mongoconfig';

import './auth/auth';
import { passport } from './auth/auth';

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(cookieParser());

let db: Db;

dbClient.connect((err, database) => {
    if (err) throw err;

    db = database.db('stdevdb');

    app.listen(port, () => {
        return console.log(`The server is listening on port ${port}`);
    });
});

app.use('/api/splits', trainingSplitRouter);
app.use('/api/auth', authRouter);

app.get('/', async (req, res) => {
    res.send('The app is working :)');
});

process.on('SIGINT', () => {
    dbClient.close();
    process.exit();
});

export { db };
