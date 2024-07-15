import { Request, Response } from 'express';
import { getBuildingConfig, configureBuilding as configureBuildingService } from '../services/elevatorService';
import { Building } from '../models/building';

// Create a building instance with initial configuration
const building = new Building(10, 5);

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
export const getBuildingConfigController = (req: Request, res: Response): void => {
    res.json(getBuildingConfig());
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
export const configureBuildingController = (req: Request, res: Response): void => {
    const { numberOfFloors, activeElevators } = req.body;
    configureBuildingService(numberOfFloors, activeElevators);
    res.status(200).send('Building configuration updated');
};
