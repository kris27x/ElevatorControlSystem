import React, { useEffect } from 'react';
import ElevatorPanel from '../components/ElevatorPanel';
import ElevatorStatus from '../components/ElevatorStatus';
import BuildingConfig from '../components/BuildingConfig';
import useElevatorSystem from '../hooks/useElevatorSystem';
import axios from 'axios';

/**
 * HomePage component.
 * 
 * This component serves as the main page of the application. It renders the ElevatorPanel,
 * ElevatorStatus, and BuildingConfig components, providing the user interface for interacting
 * with the elevator control system.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const HomePage: React.FC = () => {
    const { elevators, fetchStatus, numberOfFloors, setNumberOfFloors, fetchBuildingConfig } = useElevatorSystem();

    useEffect(() => {
        fetchBuildingConfig();
    });

    /**
     * Handle the simulation step.
     * 
     * This function is called when the user clicks the "Simulate Step" button. It sends a POST request
     * to the backend server to execute a simulation step for all elevators.
     * 
     * @async
     * @function
     * @returns {Promise<void>} A promise that resolves when the simulation step is completed.
     */
    async function handleSimulateStep(): Promise<void> {
        try {
            await axios.post('http://localhost:5000/api/elevators/step');
            alert('Simulation step executed');
            fetchStatus(); // Fetch the updated status
        } catch (error) {
            console.error('Error executing simulation step', error);
            alert('Error executing simulation step');
        }
    }

    /**
     * Handle the building configuration update.
     * 
     * This function is called when the building configuration is updated.
     * It updates the number of floors state.
     * 
     * @param {number} newNumberOfFloors - The new number of floors.
     */
    const handleBuildingConfigUpdate = (newNumberOfFloors: number) => {
        setNumberOfFloors(newNumberOfFloors);
    };

    return (
        <div>
            <h1>Elevator Control System</h1>
            <BuildingConfig fetchStatus={fetchStatus} onConfigUpdate={handleBuildingConfigUpdate} />
            <ElevatorPanel fetchStatus={fetchStatus} numberOfFloors={numberOfFloors} />
            <ElevatorStatus elevators={elevators} />
            <button onClick={handleSimulateStep}>Simulate Step</button>
        </div>
    );
};

export default HomePage;
