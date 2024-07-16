import { Router } from 'express';
import { getElevatorStatus, pickupElevator, executeStep, addTargetFloor } from '../controllers/elevatorController';

// Create a new router instance
const router = Router();

/**
 * Route to get the status of all elevators.
 * 
 * GET /api/elevators/status
 * 
 * This route handles GET requests to retrieve the current status of all elevators.
 * It calls the getElevatorStatus controller function to fetch the data.
 */
router.get('/status', getElevatorStatus);

/**
 * Route to request an elevator pickup.
 * 
 * POST /api/elevators/pickup
 * 
 * This route handles POST requests to request an elevator pickup.
 * It calls the pickupElevator controller function to process the request.
 */
router.post('/pickup', pickupElevator);

/**
 * Route to execute a simulation step for all elevators.
 * 
 * POST /api/elevators/step
 * 
 * This route handles POST requests to execute a simulation step for all elevators.
 * It calls the executeStep controller function to perform the simulation step.
 */
router.post('/step', executeStep);

/**
 * Route to add a target floor to a specific elevator.
 * 
 * POST /api/elevators/target
 * 
 * This route handles POST requests to add a target floor to an elevator.
 * It calls the addTargetFloor controller function to process the request.
 */
router.post('/target', addTargetFloor);

export default router;
