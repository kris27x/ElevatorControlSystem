import { Request, Response } from 'express';
import { getStatus, pickup, update, step, configureBuilding as configureBuildingService } from '../services/elevatorService';
import { pso } from '../services/psoService';

/**
 * Controller to handle the retrieval of elevator statuses.
 * 
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * 
 * @returns {void}
 * 
 * This function handles GET requests to retrieve the current status of all elevators.
 * It uses the getStatus service function to fetch the data and sends it as a JSON response.
 */
export const getElevatorStatus = (req: Request, res: Response): void => {
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
 * It extracts the floor and direction from the request body, then uses the PSO algorithm
 * to determine the best elevator for the pickup. It updates the elevator's target floor and status.
 */
export const pickupElevator = (req: Request, res: Response): void => {
    const { floor, direction } = req.body;
    const bestElevator = pso(floor, direction);
    if (bestElevator) {
        pickup(floor, direction);
        res.status(200).send(`Pickup request received and assigned to Elevator ${bestElevator.id}`);
    } else {
        res.status(404).send('No suitable elevator found for pickup request');
    }
};

/**
 * Controller to handle updates to the elevator status.
 * 
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * 
 * @returns {void}
 * 
 * This function handles POST requests to update the status of a specific elevator.
 * It extracts the elevator ID, current floor, and target floor from the request body,
 * then uses the update service function to update the elevator status. A success response is sent back to the client.
 */
export const updateElevator = (req: Request, res: Response): void => {
    const { id, floor, target } = req.body;
    update(id, floor, target);
    res.status(200).send('Update request received');
};

/**
 * Controller to execute a simulation step for all elevators.
 * 
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * 
 * @returns {void}
 * 
 * This function handles POST requests to execute a simulation step for all elevators.
 * It calls the step service function to perform the simulation step and sends a success response back to the client.
 */
export const executeStep = (req: Request, res: Response): void => {
    step();
    res.status(200).send('Step executed');
};

/**
 * Controller to configure the building's number of floors and active elevators.
 * 
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * 
 * @returns {void}
 * 
 * This function handles POST requests to configure the building's settings.
 * It extracts the number of floors and active elevators from the request body,
 * then uses the configureBuilding service function to update the building's configuration.
 */
export const configureBuilding = (req: Request, res: Response): void => {
    const { numberOfFloors, activeElevators } = req.body;
    configureBuildingService(numberOfFloors, activeElevators);
    res.status(200).send('Building configuration updated');
};
