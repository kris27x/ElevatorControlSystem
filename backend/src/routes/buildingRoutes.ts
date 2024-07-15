import { Router } from 'express';
import { getBuildingConfigController, configureBuildingController } from '../controllers/buildingController';

// Create a new router instance
const router = Router();

/**
 * Route to get the building configuration.
 * 
 * GET /api/building/config
 * 
 * This route handles GET requests to retrieve the building configuration.
 * It calls the getBuildingConfigController function to fetch the data.
 */
router.get('/config', getBuildingConfigController);

/**
 * Route to configure the building's number of floors and active elevators.
 * 
 * POST /api/building/configure
 * 
 * This route handles POST requests to configure the building's settings.
 * It calls the configureBuildingController function to update the building configuration.
 */
router.post('/configure', configureBuildingController);

export default router;
