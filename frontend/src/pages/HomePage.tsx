import React from 'react';
import ElevatorPanel from '../components/ElevatorPanel';
import ElevatorStatus from '../components/ElevatorStatus';

/**
 * HomePage component.
 * 
 * This component serves as the main page of the application. It renders the ElevatorPanel and ElevatorStatus components,
 * providing the user interface for interacting with the elevator control system.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Elevator Control System</h1>
            <ElevatorPanel />
            <ElevatorStatus />
        </div>
    );
};

export default HomePage;
