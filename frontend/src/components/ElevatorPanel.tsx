import React, { useState } from 'react';
import axios from 'axios';

/**
 * ElevatorPanel component.
 * 
 * This component provides a user interface for making elevator pickup requests.
 * It allows the user to specify the floor and direction (up or down) and send the request to the backend server.
 * 
 * @param {{ fetchStatus: () => Promise<void>, numberOfFloors: number }} props - The props object containing the fetchStatus function and the maximum number of floors.
 * @returns {JSX.Element} The rendered component.
 */
const ElevatorPanel: React.FC<{ fetchStatus: () => Promise<void>; numberOfFloors: number }> = ({ fetchStatus, numberOfFloors }) => {
    // State variables for the floor number and direction of the pickup request
    const [floor, setFloor] = useState<number>(0);
    const [direction, setDirection] = useState<number>(1);

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
            fetchStatus(); // Fetch the updated status
        } catch (error) {
            console.error('Error sending pickup request', error);
            alert('Error sending pickup request');
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
        const value = parseInt(e.target.value, 10);
        if (value >= 0 && value <= numberOfFloors) {
            setFloor(value);
        } else if (value > numberOfFloors) {
            setFloor(numberOfFloors);
        } else {
            setFloor(0);
        }
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
        </div>
    );
};

export default ElevatorPanel;
