import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Elevator {
    id: number;
    currentFloor: number;
    targetFloor: number | null;
    status: 'up' | 'down' | 'idle' | 'off';
}

/**
 * ElevatorStatus component.
 * 
 * This component fetches and displays the status of all elevators. It shows each elevator's ID, current floor,
 * target floor, and status. The component makes use of the useEffect hook to fetch data from the backend
 * when the component mounts, and the useState hook to manage the fetched data.
 * 
 * @returns {JSX.Element} The rendered component displaying the status of all elevators.
 */
const ElevatorStatus: React.FC = () => {
    const [elevators, setElevators] = useState<Elevator[]>([]);

    /**
     * Fetch the status of all elevators from the backend server.
     * 
     * This function is called when the component mounts (due to the empty dependency array in useEffect).
     * It sends a GET request to the backend server to retrieve the status of all elevators and updates the
     * component's state with the retrieved data.
     * 
     * @returns {Promise<void>} A promise that resolves when the data has been successfully fetched and the state updated.
     */
    useEffect(() => {
        const fetchStatus = async (): Promise<void> => {
            try {
                // Send a GET request to the backend server to retrieve elevator statuses
                const response = await axios.get('http://localhost:5000/api/elevators/status');
                // Update the state with the retrieved data
                setElevators(response.data);
            } catch (error) {
                console.error('Error fetching elevator status', error);
            }
        };

        // Call the fetchStatus function to fetch elevator statuses
        fetchStatus();
    }, []);

    return (
        <div>
            <h2>Elevator Status</h2>
            <ul>
                {elevators.map((elevator) => (
                    <li key={elevator.id}>
                        Elevator {elevator.id}: Floor {elevator.currentFloor} - Target {elevator.targetFloor ?? 'None'} - Status {elevator.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ElevatorStatus;
