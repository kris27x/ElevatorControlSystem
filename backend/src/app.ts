import express from 'express';
import cors from 'cors';
import elevatorRoutes from './routes/elevatorRoutes';
import buildingRoutes from './routes/buildingRoutes';

// Create an instance of Express
const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Routes for elevator-related API endpoints
app.use('/api/elevators', elevatorRoutes);

// Routes for building-related API endpoints
app.use('/api/building', buildingRoutes);

export default app;
