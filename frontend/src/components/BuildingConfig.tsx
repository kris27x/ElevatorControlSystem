import React, { useState } from 'react';
import axios from 'axios';

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
    // State variables for the number of floors and active elevators
    const [numberOfFloors, setNumberOfFloors] = useState<number>(10);
    const [activeElevators, setActiveElevators] = useState<number>(5);

    /**
     * Handle the configuration update.
     * 
     * This function is called when the user clicks the "Update Configuration" button.
     * It sends a POST request to the backend server with the specified number of floors and active elevators.
     * 
     * @async
     * @function
     * @returns {Promise<void>}
     */
    const handleConfigure = async (): Promise<void> => {
        try {
            await axios.post('http://localhost:5000/api/elevators/configure', { numberOfFloors, activeElevators });
            alert('Building configuration updated');
            await fetchStatus(); // Fetch the updated status to reset elevator statuses
            onConfigUpdate(numberOfFloors); // Update the number of floors in the parent component
        } catch (error) {
            console.error('Error updating building configuration', error);
            alert('Error updating building configuration');
        }
    };

    return (
        <div>
            <h2>Building Configuration</h2>
            <div>
                <label>
                    Number of Floors:
                    <input 
                        type="number" 
                        value={numberOfFloors} 
                        onChange={(e) => setNumberOfFloors(parseInt(e.target.value, 10))}
                        min="1"
                        max="100"
                    />
                </label>
            </div>
            <div>
                <label>
                    Active Elevators:
                    <input 
                        type="number" 
                        value={activeElevators} 
                        onChange={(e) => setActiveElevators(parseInt(e.target.value, 10))}
                        min="1"
                        max="16"
                    />
                </label>
            </div>
            <button onClick={handleConfigure}>Update Configuration</button>
        </div>
    );
};

export default BuildingConfig;
