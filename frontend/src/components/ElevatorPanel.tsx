import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Alert, FormControl, Select, MenuItem, InputLabel, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './ErrorBoundary';

/**
 * ElevatorPanel component.
 * 
 * This component provides a user interface for making elevator pickup requests
 * and for adding target floors to specific elevators. It allows the user to specify
 * the floor and direction (up or down) for pickup requests and to add target floors
 * to available elevators.
 * 
 * @param {{ fetchStatus: () => Promise<void>, numberOfFloors: number }} props - The props object containing the fetchStatus function and the maximum number of floors.
 * @returns {JSX.Element} The rendered component.
 */
const ElevatorPanel: React.FC<{ fetchStatus: () => Promise<void>; numberOfFloors: number }> = ({ fetchStatus, numberOfFloors }) => {
    const [floor, setFloor] = useState<number>(1);
    const [direction, setDirection] = useState<number>(1);
    const [selectedElevator, setSelectedElevator] = useState<number | null>(null);
    const [targetFloor, setTargetFloor] = useState<number>(1);
    const [availableElevators, setAvailableElevators] = useState<{ id: number, status: string }[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        /**
         * Fetch the status of elevators to get the available ones.
         * 
         * This function is called when the component mounts and whenever the fetchStatus function is called.
         */
        const fetchAvailableElevators = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/elevators/status', {
                    withCredentials: true,
                });
                const available = response.data.filter((elevator: { status: string }) => elevator.status !== 'off');
                setAvailableElevators(available);
            } catch (error) {
                console.error('Error fetching elevator status', error);
                toast.error('Error fetching elevator status');
            }
        };

        fetchAvailableElevators();
    }, [fetchStatus]);

    useEffect(() => {
        if (selectedElevator !== null && !availableElevators.some(elevator => elevator.id === selectedElevator)) {
            setSelectedElevator(null);
        }
        if (floor > numberOfFloors) {
            setFloor(1);
        }
        if (targetFloor > numberOfFloors) {
            setTargetFloor(1);
        }
    }, [numberOfFloors, availableElevators, selectedElevator, floor, targetFloor]);

    /**
     * Handle the pickup request.
     * 
     * This function is called when the user clicks the "Call Elevator" button. It sends a POST request
     * to the backend server with the specified floor and direction. The backend processes the request
     * and assigns an idle elevator to the floor if available.
     * 
     * @async
     * @function
     * @returns {Promise<void>} A promise that resolves when the request is completed.
     */
    const handlePickup = async (): Promise<void> => {
        if (floor < 0 || floor > (numberOfFloors - 1)) {
            toast.error(`Floor must be between 0 and ${(numberOfFloors - 1)}`);
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/elevators/pickup', { floor, direction }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.success('Pickup request sent');
            await fetchStatus();
            setError(null);
        } catch (error) {
            console.error('Error sending pickup request', error);
            toast.error('Error sending pickup request');
        }
    };

    /**
     * Handle adding a target floor to the selected elevator.
     * 
     * This function is called when the user clicks the "Add Target Floor" button. It sends a POST request
     * to the backend server with the selected elevator ID and the target floor. The backend processes the request
     * and adds the target floor to the elevator if available.
     * 
     * @async
     * @function
     * @returns {Promise<void>} A promise that resolves when the request is completed.
     */
    const handleAddTargetFloor = async (): Promise<void> => {
        if (selectedElevator === null) {
            toast.error('Please select an elevator');
            return;
        }

        if (targetFloor < 0 || targetFloor > (numberOfFloors - 1)) {
            toast.error(`Target floor must be between 0 and ${(numberOfFloors - 1)}`);
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/elevators/target', { id: selectedElevator, targetFloor }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.success(`Target floor ${targetFloor} added to Elevator ${selectedElevator}`);
            await fetchStatus();
            setError(null);
        } catch (error) {
            console.error('Error adding target floor', error);
            toast.error('Error adding target floor');
        }
    };

    /**
     * Handle the change of the floor input value.
     * 
     * This function ensures that the entered floor value does not exceed the maximum number of floors.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleFloorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value)) value = 0;
        value = Math.max(0, Math.min(numberOfFloors - 1, value));
        setFloor(value);
    };

    /**
     * Handle the change of the target floor input value.
     * 
     * This function ensures that the entered target floor value does not exceed the maximum number of floors.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleTargetFloorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value)) value = 0;
        value = Math.max(0, Math.min(numberOfFloors - 1, value));
        setTargetFloor(value);
    };

    return (
        <ErrorBoundary>
            <Container maxWidth="md" component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Box my={4}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Elevator Panel
                    </Typography>
                    {error && (
                        <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <form>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    Call Elevator
                                </Typography>
                                <Box my={2}>
                                    <TextField
                                        label="Floor"
                                        type="number"
                                        value={floor}
                                        onChange={handleFloorChange}
                                        inputProps={{ min: 0, max: numberOfFloors - 1}}
                                        fullWidth
                                    />
                                </Box>
                                <Box my={2}>
                                    <FormControl fullWidth>
                                        <InputLabel>Direction</InputLabel>
                                        <Select
                                            value={String(direction)}
                                            onChange={(e) => setDirection(parseInt(e.target.value))}
                                            fullWidth
                                        >
                                            <MenuItem value="1">Up</MenuItem>
                                            <MenuItem value="-1">Down</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box my={2}>
                                    <Button variant="contained" color="primary" onClick={handlePickup} fullWidth>
                                        Call Elevator
                                    </Button>
                                </Box>
                            </form>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <form>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    Add Target Floor
                                </Typography>
                                <Box my={2}>
                                    <TextField
                                        label="Target Floor"
                                        type="number"
                                        value={targetFloor}
                                        onChange={handleTargetFloorChange}
                                        inputProps={{ min: 0, max: numberOfFloors - 1}}
                                        fullWidth
                                    />
                                </Box>
                                <Box my={2}>
                                    <FormControl fullWidth>
                                        <InputLabel>Select Elevator</InputLabel>
                                        <Select
                                            value={selectedElevator !== null ? String(selectedElevator) : ''}
                                            onChange={(e) => setSelectedElevator(parseInt(e.target.value))}
                                            fullWidth
                                        >
                                            <MenuItem value="" disabled>Select an elevator</MenuItem>
                                            {availableElevators.map((elevator) => (
                                                <MenuItem key={elevator.id} value={String(elevator.id)}>
                                                    Elevator {elevator.id} - {elevator.status}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box my={2}>
                                    <Button variant="contained" color="primary" onClick={handleAddTargetFloor} fullWidth>
                                        Add Target Floor
                                    </Button>
                                </Box>
                            </form>
                        </Grid>
                    </Grid>
                </Box>
                <ToastContainer />
            </Container>
        </ErrorBoundary>
    );
};

export default ElevatorPanel;
