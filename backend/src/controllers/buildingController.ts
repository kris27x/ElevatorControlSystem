import { Request, Response } from 'express';
import { Building } from '../models/building';

// Create a building instance with initial configuration
const building = new Building(10, 5); // Default to 10 floors and 5 active elevators

/**
 * Controller to handle the retrieval of building configuration.
 * 
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * 
 * @returns {void}
 * 
 * This function handles GET requests to retrieve the building configuration.
 * It sends the building configuration as a JSON response.
 */
export const getBuildingConfig = (req: Request, res: Response): void => {
    res.json(building.config);
};
