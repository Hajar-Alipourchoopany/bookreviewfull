import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import routes from './route/routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

// Verwende CORS-Middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(cookieParser());

// Middleware
app.use(express.json());

// Routen
app.use('/api', routes);

// Startet den Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
