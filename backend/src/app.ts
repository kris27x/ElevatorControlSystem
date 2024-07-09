import express from 'express';
import cors from 'cors';
import elevatorRoutes from './routes/elevatorRoutes';

// Create an instance of Express
const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Routes for elevator-related API endpoints
app.use('/api/elevators', elevatorRoutes);

export default app;
