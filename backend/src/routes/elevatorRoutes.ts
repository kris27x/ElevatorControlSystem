import { Router } from 'express';
import { getElevatorStatus, pickupElevator, updateElevator, executeStep } from '../controllers/elevatorController';

// Create a new router instance
const router = Router();

// Route to get the status of all elevators
router.get('/status', getElevatorStatus);

// Route to request an elevator pickup
router.post('/pickup', pickupElevator);

// Route to update the status of a specific elevator
router.post('/update', updateElevator);

// Route to execute a simulation step for all elevators
router.post('/step', executeStep);

export default router;
