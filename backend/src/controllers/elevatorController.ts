import { Request, Response } from 'express';
import { getStatus, pickup, step, addTarget } from '../services/elevatorService';
import { selectBestElevator } from '../services/algorithm';
import { Building } from '../models/building';

// Create a building instance with initial configuration
const building = new Building(10, 5);

/**
 * Controller to handle the retrieval of elevator statuses.
 * 
 * @param {Request} _req - The HTTP request object (not used).
 * @param {Response} res - The HTTP response object.
 * 
 * @returns {void}
 * 
 * This function handles GET requests to retrieve the current status of all elevators.
 * It uses the getStatus service function to fetch the data and sends it as a JSON response.
 */
export const getElevatorStatus = (_req: Request, res: Response): void => {
    res.json(getStatus());
};

/**
 * Controller to handle elevator pickup requests.
 * 
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * 
 * @returns {void}
 * 
 * This function handles POST requests to request an elevator pickup.
 * It extracts the floor and direction from the request body, then uses the selectBestElevator function
 * to determine the best elevator for the pickup. It updates the elevator's target floor and status.
 */
export const pickupElevator = (req: Request, res: Response): void => {
    const { floor, direction } = req.body;
    const bestElevator = selectBestElevator(building.elevators, floor, direction);
    if (bestElevator) {
        pickup(floor, direction);
        res.status(200).send(`Pickup request received and assigned to Elevator ${bestElevator.id}`);
    } else {
        res.status(404).send('No suitable elevator found for pickup request');
    }
};

/**
 * Controller to execute a simulation step for all elevators.
 * 
 * @param {Request} _req - The HTTP request object (not used).
 * @param {Response} res - The HTTP response object.
 * 
 * @returns {void}
 * 
 * This function handles POST requests to execute a simulation step for all elevators.
 * It calls the step service function to perform the simulation step and sends a success response back to the client.
 */
export const executeStep = (_req: Request, res: Response): void => {
    step();
    res.status(200).send('Step executed');
};

/**
 * Controller to handle adding a target floor to a specific elevator.
 * 
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * 
 * @returns {void}
 * 
 * This function handles POST requests to add a target floor to an elevator.
 * It extracts the elevator ID and target floor from the request body,
 * then uses the addTarget service function to add the target floor to the elevator.
 */
export const addTargetFloor = (req: Request, res: Response): void => {
    const { id, targetFloor } = req.body;
    const elevator = building.elevators.find(e => e.id === id);
    if (elevator) {
        addTarget(id, targetFloor);
        res.status(200).send(`Target floor ${targetFloor} added to Elevator ${id}`);
    } else {
        res.status(404).send('No suitable elevator found or elevator is off');
    }
};
