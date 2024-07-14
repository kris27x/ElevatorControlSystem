import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    // State variables for the floor number and direction of the pickup request
    const [floor, setFloor] = useState<number>(0);
    const [direction, setDirection] = useState<number>(1);
    const [selectedElevator, setSelectedElevator] = useState<number | null>(null);
    const [targetFloor, setTargetFloor] = useState<number>(0);
    const [availableElevators, setAvailableElevators] = useState<{ id: number, status: string }[]>([]);

    useEffect(() => {
        // Fetch the status of elevators to get the available ones
        const fetchAvailableElevators = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/elevators/status');
                const available = response.data.filter((elevator: { status: string }) => elevator.status !== 'off');
                setAvailableElevators(available);
            } catch (error) {
                console.error('Error fetching elevator status', error);
            }
        };

        fetchAvailableElevators();
    }, [fetchStatus]); // Add fetchStatus as a dependency

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
        try {
            // Send a POST request to the backend with the floor and direction
            await axios.post('http://localhost:5000/api/elevators/pickup', { floor, direction });
            alert('Pickup request sent');
            await fetchStatus(); // Fetch the updated status
        } catch (error) {
            console.error('Error sending pickup request', error);
            alert('Error sending pickup request');
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
            alert('Please select an elevator');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/elevators/target', { id: selectedElevator, targetFloor });
            alert(`Target floor ${targetFloor} added to Elevator ${selectedElevator}`);
            await fetchStatus(); // Fetch the updated status
        } catch (error) {
            console.error('Error adding target floor', error);
            alert('Error adding target floor');
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
        value = Math.max(0, Math.min(numberOfFloors, value));
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
        value = Math.max(0, Math.min(numberOfFloors, value));
        setTargetFloor(value);
    };

    return (
        <div>
            <h2>Elevator Panel</h2>
            <div>
                <label>
                    Floor:
                    <input
                        type="number"
                        value={floor}
                        onChange={handleFloorChange}
                        min="0"
                        max={numberOfFloors}
                    />
                </label>
            </div>
            <div>
                <label>
                    Direction:
                    <select
                        value={direction}
                        onChange={(e) => setDirection(parseInt(e.target.value, 10))}
                    >
                        <option value={1}>Up</option>
                        <option value={-1}>Down</option>
                    </select>
                </label>
            </div>
            <button onClick={handlePickup}>Call Elevator</button>
            <hr />
            <h3>Add Target Floor</h3>
            <div>
                <label>
                    Select Elevator:
                    <select
                        value={selectedElevator ?? ''}
                        onChange={(e) => setSelectedElevator(parseInt(e.target.value, 10))}
                    >
                        <option value="" disabled>Select an elevator</option>
                        {availableElevators.map((elevator) => (
                            <option key={elevator.id} value={elevator.id}>
                                Elevator {elevator.id} - {elevator.status}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Target Floor:
                    <input
                        type="number"
                        value={targetFloor}
                        onChange={handleTargetFloorChange}
                        min="0"
                        max={numberOfFloors}
                    />
                </label>
            </div>
            <button onClick={handleAddTargetFloor}>Add Target Floor</button>
        </div>
    );
};

export default ElevatorPanel;
