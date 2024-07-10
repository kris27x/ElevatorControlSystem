import React from 'react';
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
    const { elevators, fetchStatus } = useElevatorSystem();

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
    const handleSimulateStep = async (): Promise<void> => {
        try {
            await axios.post('http://localhost:5000/api/elevators/step');
            alert('Simulation step executed');
            fetchStatus(); // Fetch the updated status
        } catch (error) {
            console.error('Error executing simulation step', error);
            alert('Error executing simulation step');
        }
    };

    return (
        <div>
            <h1>Elevator Control System</h1>
            <BuildingConfig fetchStatus={fetchStatus} />
            <ElevatorPanel fetchStatus={fetchStatus} />
            <ElevatorStatus elevators={elevators} />
            <button onClick={handleSimulateStep}>Simulate Step</button>
        </div>
    );
};

export default HomePage;
