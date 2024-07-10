import { useState, useEffect } from 'react';
import axios from 'axios';

interface Elevator {
    id: number;
    currentFloor: number;
    targetFloor: number | null;
    status: 'up' | 'down' | 'idle' | 'off';
}

/**
 * Custom hook to manage the state of the elevator system.
 * 
 * This hook provides functionality to fetch and manage the status of all elevators in the system.
 * It utilizes the useState and useEffect hooks to maintain the state of the elevators and perform side effects,
 * such as fetching data from the backend server.
 * 
 * @returns {{ elevators: Elevator[], fetchStatus: () => Promise<void> }} An object containing the array of elevator statuses and a function to fetch the status.
 */
const useElevatorSystem = (): { elevators: Elevator[], fetchStatus: () => Promise<void> } => {
    // State variable to store the status of all elevators
    const [elevators, setElevators] = useState<Elevator[]>([]);

    /**
     * Fetch the status of all elevators from the backend server.
     * 
     * This function is invoked when the hook is first used and whenever the status needs to be refreshed.
     * It sends a GET request to the backend server to retrieve the status of all elevators.
     * The retrieved data is then used to update the state of the elevators.
     * 
     * @async
     * @function
     * @returns {Promise<void>} A promise that resolves when the data has been successfully fetched and the state updated.
     */
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

    // Fetch status when the hook is first used
    useEffect(() => {
        fetchStatus();
    }, []);

    // Return the elevators state and the fetchStatus function to be used by components
    return { elevators, fetchStatus };
};

export default useElevatorSystem;
