import React, { useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import ElevatorPanel from '../components/ElevatorPanel';
import ElevatorStatus from '../components/ElevatorStatus';
import BuildingConfig from '../components/BuildingConfig';
import useElevatorSystem from '../hooks/useElevatorSystem';
import axios from 'axios';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * HomePage component.
 * 
 * This component serves as the main page of the application. It renders the ElevatorPanel,
 * ElevatorStatus, and BuildingConfig components, providing the user interface for interacting
 * with the elevator control system.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const HomePage: React.FC = () => {
    const { elevators, fetchStatus, numberOfFloors, setNumberOfFloors, fetchBuildingConfig } = useElevatorSystem();

    useEffect(() => {
        fetchBuildingConfig();
    }, [fetchBuildingConfig]);

    /**
     * Handle the simulation step.
     * 
     * This function is called when the user clicks the "Simulate Step" button. It sends a POST request
     * to the backend server to execute a simulation step for all elevators.
     * 
     * @async
     * @function
     * @returns {Promise<void>} A promise that resolves when the simulation step is completed.
     */
    async function handleSimulateStep(): Promise<void> {
        try {
            await axios.post('http://localhost:5000/api/elevators/step', {}, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Simulation step executed');
            fetchStatus(); // Fetch the updated status
        } catch (error) {
            console.error('Error executing simulation step', error);
            alert('Error executing simulation step');
        }
    }

    /**
     * Handle the building configuration update.
     * 
     * This function is called when the building configuration is updated.
     * It updates the number of floors state.
     * 
     * @param {number} newNumberOfFloors - The new number of floors.
     */
    const handleBuildingConfigUpdate = (newNumberOfFloors: number) => {
        setNumberOfFloors(newNumberOfFloors);
    };

    return (
        <Container>
            <Box mt={4} mb={2}>
                <Typography variant="h3" align="center" gutterBottom>
                    Elevator Control System
                </Typography>
            </Box>
            <ErrorBoundary>
                <Box mb={4}>
                    <BuildingConfig fetchStatus={fetchStatus} onConfigUpdate={handleBuildingConfigUpdate} />
                </Box>
                <Box mb={4}>
                    <ElevatorPanel fetchStatus={fetchStatus} numberOfFloors={numberOfFloors} />
                </Box>
                <Box mb={4}>
                    <ElevatorStatus elevators={elevators} />
                </Box>
            </ErrorBoundary>
            <Box display="flex" justifyContent="center" mb={4}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="contained" color="primary" onClick={handleSimulateStep}>
                        Simulate Step
                    </Button>
                </motion.div>
            </Box>
        </Container>
    );
};

export default HomePage;
