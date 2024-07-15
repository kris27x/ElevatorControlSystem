import React, { useState } from 'react';
import { Container, Typography, TextField, MenuItem, FormControl, Select, InputLabel, Box, Grid, Card, CardContent, SelectChangeEvent } from '@mui/material';

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

    const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
        setStatusFilter(event.target.value as string);
    };

    const handleFloorFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setFloorFilter(isNaN(value) ? '' : value);
    };

    const handleIdFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setIdFilter(isNaN(value) ? '' : value);
    };

    const filteredElevators = elevators.filter((elevator) => {
        return (
            (statusFilter === '' || elevator.status === statusFilter) &&
            (floorFilter === '' || elevator.currentFloor === floorFilter) &&
            (idFilter === '' || elevator.id === idFilter)
        );
    });

    return (
        <Container>
            <Typography variant="h5" component="h1" gutterBottom>
                Elevator Status
            </Typography>
            <Box mb={2}>
                <Grid container spacing={1}>
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
            <Grid container spacing={1}>
                {filteredElevators.map((elevator) => (
                    <Grid item xs={12} sm={6} md={3} key={elevator.id}>
                        <Card sx={{ padding: 0.5 }}>
                            <CardContent sx={{ padding: 0.5 }}>
                                <Typography variant="body1" gutterBottom>
                                    Elevator {elevator.id}
                                </Typography>
                                <Grid container spacing={0.5}>
                                    <Grid item xs={4}>
                                        <Typography variant="body2">
                                            Floor: {elevator.currentFloor}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2">
                                            Targets: {elevator.targetFloors.join(', ') || 'None'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="body2">
                                            Status: {elevator.status}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ElevatorStatus;
