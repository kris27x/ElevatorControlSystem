import express from 'express';
import cors from 'cors';
import elevatorRoutes from './routes/elevatorRoutes';
import buildingRoutes from './routes/buildingRoutes';

// Create an instance of Express
const app = express();

// CORS options to allow only your frontend to access the server with credentials
const corsOptions = {
    origin: 'http://localhost:3000', // Allow only your frontend to access the server
    credentials: true, // Allow credentials (cookies, headers)
};

// Middleware to enable CORS with the specified options
app.use(cors(corsOptions));

// Middleware to parse JSON requests
app.use(express.json());

// Routes for elevator-related API endpoints
app.use('/api/elevators', elevatorRoutes);

// Routes for building-related API endpoints
app.use('/api/building', buildingRoutes);

export default app;
