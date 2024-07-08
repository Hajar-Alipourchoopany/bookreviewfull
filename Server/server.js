import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/db.js'; 
import routes from './route/routes.js'; 

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

// Verwende CORS-Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

// Middleware
app.use(express.json());

// Routen
app.use('/api', routes);

// Startet den Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
