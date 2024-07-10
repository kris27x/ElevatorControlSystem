import React, { useState } from 'react';
import axios from 'axios';

/**
 * ElevatorPanel component.
 * 
 * This component provides a user interface for making elevator pickup requests.
 * It allows the user to specify the floor and direction (up or down) and send the request to the backend server.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const ElevatorPanel: React.FC = () => {
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
        } catch (error) {
            console.error('Error sending pickup request', error);
            alert('Error sending pickup request');
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
                        onChange={(e) => setFloor(parseInt(e.target.value, 10))}
                        min="0"
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
