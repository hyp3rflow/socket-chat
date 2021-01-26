import express from 'express';
import morgan from 'morgan';

const app = express();

const { NODE_ENV } = process.env;

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export default app;
