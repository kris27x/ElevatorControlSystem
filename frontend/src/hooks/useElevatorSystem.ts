import { useState, useEffect } from 'react';
import axios from 'axios';

interface Elevator {
    id: number;
    currentFloor: number;
    targetFloors: number[]; // Updated to handle multiple targets
    status: 'up' | 'down' | 'idle' | 'off';
}

/**
 * Custom hook to manage the state of the elevator system.
 * 
 * This hook provides functionality to fetch and manage the status of all elevators in the system.
 * It utilizes the useState and useEffect hooks to maintain the state of the elevators and perform side effects,
 * such as fetching data from the backend server.
 * 
 * @returns {{ elevators: Elevator[], fetchStatus: () => Promise<void>, addTarget: (id: number, targetFloor: number) => Promise<void>, numberOfFloors: number, setNumberOfFloors: React.Dispatch<React.SetStateAction<number>> }}
 * An object containing the array of elevator statuses, functions to fetch the status and add target floors, the number of floors, and a function to set the number of floors.
 */
const useElevatorSystem = (): {
    elevators: Elevator[],
    fetchStatus: () => Promise<void>,
    addTarget: (id: number, targetFloor: number) => Promise<void>,
    numberOfFloors: number,
    setNumberOfFloors: React.Dispatch<React.SetStateAction<number>>
} => {
    // State variable to store the status of all elevators
    const [elevators, setElevators] = useState<Elevator[]>([]);
    // State variable to store the number of floors in the building
    const [numberOfFloors, setNumberOfFloors] = useState<number>(10);

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

    /**
     * Fetch the building configuration from the backend server.
     * 
     * This function is invoked when the hook is first used to retrieve the current building configuration.
     * It sends a GET request to the backend server to retrieve the number of floors in the building.
     * The retrieved data is then used to update the state of the number of floors.
     * 
     * @async
     * @function
     * @returns {Promise<void>} A promise that resolves when the data has been successfully fetched and the state updated.
     */
    const fetchBuildingConfig = async (): Promise<void> => {
        try {
            // Send a GET request to the backend server to retrieve the building configuration
            const response = await axios.get('http://localhost:5000/api/building/config');
            // Update the state with the retrieved number of floors
            setNumberOfFloors(response.data.numberOfFloors);
        } catch (error) {
            console.error('Error fetching building configuration', error);
        }
    };

    /**
     * Add a target floor to a specific elevator.
     * 
     * This function sends a POST request to the backend server to add a target floor to a specific elevator.
     * 
     * @param {number} id - The unique identifier of the elevator.
     * @param {number} targetFloor - The target floor number to be added.
     * @async
     * @function
     * @returns {Promise<void>} A promise that resolves when the target floor has been successfully added.
     */
    const addTarget = async (id: number, targetFloor: number): Promise<void> => {
        try {
            await axios.post('http://localhost:5000/api/elevators/target', { id, targetFloor });
            fetchStatus(); // Refresh the status after adding a target floor
        } catch (error) {
            console.error('Error adding target floor', error);
        }
    };

    // Fetch status and building configuration when the hook is first used
    useEffect(() => {
        fetchStatus();
        fetchBuildingConfig();
    }, []);

    // Return the elevators state, fetchStatus function, addTarget function, numberOfFloors state, and setNumberOfFloors function to be used by components
    return { elevators, fetchStatus, addTarget, numberOfFloors, setNumberOfFloors };
};

export default useElevatorSystem;
