import express from 'express';
import elevatorRoutes from './routes/elevatorRoutes';

// Create an instance of Express
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Routes for elevator-related API endpoints
app.use('/api/elevators', elevatorRoutes);

export default app;
