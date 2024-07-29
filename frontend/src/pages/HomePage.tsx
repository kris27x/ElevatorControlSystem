import React, { useEffect, useState, useRef } from 'react';
import { Container, Box, Button, Card, CardContent, Typography, TextField } from '@mui/material';
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
    const [intervalMs, setIntervalMs] = useState<number>(1000); // Default interval of 1000ms
    const [isSimulating, setIsSimulating] = useState<boolean>(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

    /**
     * Start the simulation.
     * 
     * This function starts the simulation by setting an interval to call handleSimulateStep
     * every intervalMs milliseconds.
     */
    const startSimulation = () => {
        if (!isSimulating) {
            setIsSimulating(true);
            intervalRef.current = setInterval(handleSimulateStep, intervalMs);
        }
    };

    /**
     * Stop the simulation.
     * 
     * This function stops the simulation by clearing the interval.
     */
    const stopSimulation = () => {
        if (isSimulating) {
            setIsSimulating(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    };

    /**
     * Handle interval change.
     * 
     * This function updates the intervalMs state when the user changes the interval input.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
     */
    const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIntervalMs(Number(event.target.value));
    };

    return (
        <Container maxWidth="md">
            <ErrorBoundary>
                <Box my={4}>
                    <Card variant="outlined" sx={{ borderRadius: 4, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h5" component="h2" gutterBottom textAlign="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                Control Panel
                            </Typography>
                            <ElevatorPanel fetchStatus={fetchStatus} numberOfFloors={numberOfFloors} />
                        </CardContent>
                    </Card>
                </Box>
                <Box my={4}>
                    <Card variant="outlined" sx={{ borderRadius: 4, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h5" component="h2" gutterBottom textAlign="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                System Status
                            </Typography>
                            <ElevatorStatus elevators={elevators} />
                            <Box display="flex" justifyContent="center" mt={4}>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button variant="contained" color="primary" onClick={handleSimulateStep}>
                                        Simulate Single Step
                                    </Button>
                                </motion.div>
                            </Box>
                            <Box display="flex" justifyContent="center" mt={4}>
                                <TextField
                                    label="Interval (ms)"
                                    type="number"
                                    value={intervalMs}
                                    onChange={handleIntervalChange}
                                    sx={{ mr: 2 }}
                                />
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button variant="contained" color="primary" onClick={startSimulation} disabled={isSimulating}>
                                        Start Simulation
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button variant="contained" color="secondary" onClick={stopSimulation} disabled={!isSimulating} style={{ marginLeft: '8px' }}>
                                        Stop Simulation
                                    </Button>
                                </motion.div>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
                <Box my={4}>
                    <Card variant="outlined" sx={{ borderRadius: 4, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h5" component="h2" gutterBottom textAlign="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                Building Configuration
                            </Typography>
                            <BuildingConfig fetchStatus={fetchStatus} onConfigUpdate={handleBuildingConfigUpdate} />
                        </CardContent>
                    </Card>
                </Box>
            </ErrorBoundary>
        </Container>
    );
};

export default HomePage;
