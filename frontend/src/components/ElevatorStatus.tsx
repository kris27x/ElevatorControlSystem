import React from 'react';

interface Elevator {
    id: number;
    currentFloor: number;
    targetFloor: number | null;
    status: 'up' | 'down' | 'idle' | 'off';
}

/**
 * ElevatorStatus component.
 * 
 * This component displays the status of all elevators. It shows each elevator's ID, current floor,
 * target floor, and status. The elevator statuses are passed as props to this component.
 * 
 * @param {{ elevators: Elevator[] }} props - The props object containing the array of elevator statuses.
 * @returns {JSX.Element} The rendered component displaying the status of all elevators.
 */
const ElevatorStatus: React.FC<{ elevators: Elevator[] }> = ({ elevators }) => {
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
