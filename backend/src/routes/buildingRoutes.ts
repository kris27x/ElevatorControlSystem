import { Router } from 'express';
import { getBuildingConfig } from '../controllers/buildingController';

// Create a new router instance
const router = Router();

/**
 * Route to get the building configuration.
 * 
 * GET /api/building/config
 * 
 * This route handles GET requests to retrieve the building configuration.
 * It calls the getBuildingConfig controller function to fetch the data.
 */
router.get('/config', getBuildingConfig);

export default router;
