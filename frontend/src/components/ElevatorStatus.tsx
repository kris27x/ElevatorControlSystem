import React, { useState } from 'react';
import { Container, Typography, TextField, MenuItem, FormControl, Select, InputLabel, Box, Grid, Card, CardContent, SelectChangeEvent } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * Elevator interface defining the structure of an elevator object.
 */
interface Elevator {
    id: number;
    currentFloor: number;
    targetFloors: number[];
    status: 'up' | 'down' | 'idle' | 'off';
}

/**
 * ElevatorStatus component.
 * 
 * This component displays the status of all elevators. It shows each elevator's ID, current floor,
 * target floors, and status. The elevator statuses are passed as props to this component.
 * 
 * @param {{ elevators: Elevator[] }} props - The props object containing the array of elevator statuses.
 * @returns {JSX.Element} The rendered component displaying the status of all elevators.
 */
const ElevatorStatus: React.FC<{ elevators: Elevator[] }> = ({ elevators }) => {
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [floorFilter, setFloorFilter] = useState<number | ''>('');
    const [idFilter, setIdFilter] = useState<number | ''>('');

    /**
     * Handles changes to the status filter.
     * 
     * @param {SelectChangeEvent<string>} event - The event triggered by changing the status filter.
     */
    const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
        setStatusFilter(event.target.value as string);
    };

    /**
     * Handles changes to the floor filter.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} event - The event triggered by changing the floor filter.
     */
    const handleFloorFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setFloorFilter(isNaN(value) ? '' : value);
    };

    /**
     * Handles changes to the ID filter.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} event - The event triggered by changing the ID filter.
     */
    const handleIdFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setIdFilter(isNaN(value) ? '' : value);
    };

    /**
     * Filters the elevators based on the current filters.
     * 
     * @returns {Elevator[]} The filtered array of elevators.
     */
    const filteredElevators = elevators.filter((elevator) => {
        return (
            (statusFilter === '' || elevator.status === statusFilter) &&
            (floorFilter === '' || elevator.currentFloor === floorFilter) &&
            (idFilter === '' || elevator.id === idFilter)
        );
    });

    /**
     * Gets the color based on the elevator's status.
     * 
     * @param {string} status - The status of the elevator.
     * @returns {string} The color associated with the status.
     */
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'up':
                return 'rgba(173, 216, 230, 0.6)'; // Light Blue
            case 'down':
                return 'rgba(255, 223, 186, 0.6)'; // Light Yellow
            case 'idle':
                return 'rgba(144, 238, 144, 0.6)'; // Light Green
            case 'off':
                return 'rgba(255, 182, 193, 0.6)'; // Light Red
            default:
                return 'rgba(211, 211, 211, 0.6)'; // Light Grey
        }
    };

    return (
        <Container>
            <Box mb={2} display="flex" justifyContent="center">
                <Grid container spacing={1} justifyContent="center">
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select value={statusFilter} onChange={handleStatusFilterChange} displayEmpty>
                                <MenuItem value=""><em>All</em></MenuItem>
                                <MenuItem value="up">Up</MenuItem>
                                <MenuItem value="down">Down</MenuItem>
                                <MenuItem value="idle">Idle</MenuItem>
                                <MenuItem value="off">Off</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Current Floor"
                            type="number"
                            value={floorFilter}
                            onChange={handleFloorFilterChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Elevator ID"
                            type="number"
                            value={idFilter}
                            onChange={handleIdFilterChange}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </Box>
            <Grid container spacing={1} justifyContent="center">
                {filteredElevators.map((elevator) => (
                    <Grid item xs={12} sm={6} md={3} key={elevator.id}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Card
                                sx={{
                                    padding: 0.5,
                                    boxShadow: 3,
                                    borderRadius: 2,
                                    background: getStatusColor(elevator.status),
                                    color: '#333'
                                }}
                            >
                                <CardContent sx={{ padding: 0.5 }}>
                                    <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        Elevator {elevator.id}
                                    </Typography>
                                    <Grid container spacing={0.5}>
                                        <Grid item xs={4}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#666' }}>
                                                Floor:
                                            </Typography>
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 1 }}
                                                whileTap={{ scale: 0.9, rotate: -1 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                                style={{ display: 'inline-block' }}
                                            >
                                                <Typography variant="body2" sx={{ color: '#000', background: '#fff', borderRadius: '4px', padding: '2px 4px' }}>
                                                    {elevator.currentFloor}
                                                </Typography>
                                            </motion.div>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#666' }}>
                                                Targets:
                                            </Typography>
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 1 }}
                                                whileTap={{ scale: 0.9, rotate: -1 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                                style={{ display: 'inline-block' }}
                                            >
                                                <Typography variant="body2" sx={{ color: '#000', background: '#fff', borderRadius: '4px', padding: '2px 4px' }}>
                                                    {elevator.targetFloors.join(', ') || 'None'}
                                                </Typography>
                                            </motion.div>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#666' }}>
                                                Status:
                                            </Typography>
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 1 }}
                                                whileTap={{ scale: 0.9, rotate: -1 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                                style={{ display: 'inline-block' }}
                                            >
                                                <Typography variant="body2" sx={{ color: '#000', background: '#fff', borderRadius: '4px', padding: '2px 4px' }}>
                                                    {elevator.status}
                                                </Typography>
                                            </motion.div>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ElevatorStatus;
