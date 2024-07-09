import { Request, Response } from 'express';
import { getStatus, pickup, update, step } from '../services/elevatorService';

/**
 * Controller to handle the retrieval of elevator statuses.
 * 
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * 
 * @returns {void}
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
 */
export const pickupElevator = (req: Request, res: Response): void => {
    const { floor, direction } = req.body;
    pickup(floor, direction);
    res.status(200).send('Pickup request received');
};

/**
 * Controller to handle updates to the elevator status.
 * 
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * 
 * @returns {void}
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
 */
export const executeStep = (req: Request, res: Response): void => {
    step();
    res.status(200).send('Step executed');
};
