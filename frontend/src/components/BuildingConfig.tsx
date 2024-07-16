import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import ErrorBoundary from './ErrorBoundary';

const MAX_FLOORS = 100;
const MAX_ELEVATORS = 16;

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * BuildingConfig component.
 * 
 * This component provides a user interface for configuring the number of floors and active elevators.
 * It allows the user to specify the number of floors and active elevators in the building and send this configuration to the backend.
 * 
 * @param {{ fetchStatus: () => Promise<void>, onConfigUpdate: (numberOfFloors: number) => void }} props - The props object containing the fetchStatus function and the onConfigUpdate callback.
 * @returns {JSX.Element} The rendered component.
 */
const BuildingConfig: React.FC<{ fetchStatus: () => Promise<void>, onConfigUpdate: (numberOfFloors: number) => void }> = ({ fetchStatus, onConfigUpdate }) => {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            numberOfFloors: 10,
            activeElevators: 5,
        }
    });

    const [isDialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ numberOfFloors: 10, activeElevators: 5 });

    /**
     * Handle form submission.
     * 
     * This function is called when the user submits the form. It sets the form data and opens the confirmation dialog.
     * 
     * @param {{ numberOfFloors: number, activeElevators: number }} data - The form data containing the number of floors and active elevators.
     */
    const onSubmit = (data: { numberOfFloors: number, activeElevators: number }) => {
        setFormData(data);
        setDialogOpen(true);
    };

    useEffect(() => {
        if (formData.numberOfFloors > MAX_FLOORS) {
            setFormData({ ...formData, numberOfFloors: MAX_FLOORS });
        }
        if (formData.activeElevators > MAX_ELEVATORS) {
            setFormData({ ...formData, activeElevators: MAX_ELEVATORS });
        }
    }, [formData]);

    /**
     * Handle confirmation of the update.
     * 
     * This function is called when the user confirms the update in the dialog. It sends a POST request to the backend
     * to update the building configuration and then fetches the updated status.
     */
    const handleConfirm = async () => {
        try {
            await axios.post(`${API_URL}/building/configure`, formData, {
                withCredentials: true, // Ensure CSRF protection
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Building configuration updated');
            await fetchStatus();
            onConfigUpdate(formData.numberOfFloors);
            reset();
        } catch (err) {
            console.error('Error updating building configuration', err);
            if (axios.isAxiosError(err)) {
                const errorMessage = err.response?.data?.message || 'Failed to update building configuration. Please try again later.';
                alert(`Error: ${errorMessage}`);
            } else {
                alert('An unexpected error occurred.');
            }
        } finally {
            setDialogOpen(false);
        }
    };

    return (
        <ErrorBoundary>
            <Container maxWidth="sm" component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Box my={4} textAlign="center">
                    <Typography variant="h4" component="h1" gutterBottom>
                        Building Configuration
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box my={2}>
                            <Controller
                                name="numberOfFloors"
                                control={control}
                                rules={{
                                    required: 'Number of floors is required',
                                    min: { value: 1, message: `Minimum value is 1` },
                                    max: { value: MAX_FLOORS, message: `Maximum value is ${MAX_FLOORS}` },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Number of Floors"
                                        type="number"
                                        inputProps={{ min: 1, max: MAX_FLOORS }}
                                        error={!!errors.numberOfFloors}
                                        helperText={errors.numberOfFloors ? errors.numberOfFloors.message : `1-${MAX_FLOORS}`}
                                        fullWidth
                                    />
                                )}
                            />
                        </Box>
                        <Box my={2}>
                            <Controller
                                name="activeElevators"
                                control={control}
                                rules={{
                                    required: 'Number of active elevators is required',
                                    min: { value: 1, message: `Minimum value is 1` },
                                    max: { value: MAX_ELEVATORS, message: `Maximum value is ${MAX_ELEVATORS}` },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Active Elevators"
                                        type="number"
                                        inputProps={{ min: 1, max: MAX_ELEVATORS }}
                                        error={!!errors.activeElevators}
                                        helperText={errors.activeElevators ? errors.activeElevators.message : `1-${MAX_ELEVATORS}`}
                                        fullWidth
                                    />
                                )}
                            />
                        </Box>
                        {errors.numberOfFloors || errors.activeElevators ? (
                            <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
                                Please fix the errors before submitting.
                            </Alert>
                        ) : null}
                        <Box my={2}>
                            <Button variant="contained" color="primary" type="submit" fullWidth>
                                Update Configuration
                            </Button>
                        </Box>
                    </form>
                </Box>

                <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle>Confirm Update</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to update the building configuration to {formData.numberOfFloors} floors and {formData.activeElevators} active elevators?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} color="primary">
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ErrorBoundary>
    );
};

export default BuildingConfig;
