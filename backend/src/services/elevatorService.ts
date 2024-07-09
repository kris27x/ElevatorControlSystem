import { Elevator } from '../models/elevator';
import { Building } from '../models/building';

// Create a building instance with initial configuration
const building = new Building(10, 5); // Default to 10 floors and 5 active elevators

/**
 * Get the status of all elevators.
 * 
 * @returns {Elevator[]} Array of elevator statuses.
 * 
 * This function returns the current status of all elevators in the system.
 * The status includes each elevator's ID, current floor, target floor, and status.
 */
export const getStatus = (): Elevator[] => {
    return building.getElevatorStatus();
};

/**
 * Handle a pickup request for an elevator.
 * 
 * @param {number} floor - The floor number where the pickup request is made.
 * @param {number} direction - The direction of the requested pickup (-1 for down, 1 for up).
 * 
 * This function processes a pickup request by assigning the best elevator
 * to the pickup request. The elevator's target floor and direction are updated accordingly.
 */
export const pickup = (floor: number, direction: number): void => {
    // Simplified algorithm to assign the best available elevator to the pickup request
    const elevator = building.elevators.find(e => e.status === 'idle');
    if (elevator) {
        elevator.targetFloor = floor;
        elevator.status = direction === 1 ? 'up' : 'down';
    }
};

/**
 * Update the status of a specific elevator.
 * 
 * @param {number} id - The unique identifier of the elevator.
 * @param {number} floor - The current floor number of the elevator.
 * @param {number} target - The target floor number of the elevator.
 * 
 * This function updates the status of a specific elevator. It sets the elevator's current floor,
 * target floor, and status based on the provided parameters.
 */
export const update = (id: number, floor: number, target: number): void => {
    const elevator = building.elevators.find(e => e.id === id);
    if (elevator && elevator.status !== 'off') {
        elevator.currentFloor = floor;
        elevator.targetFloor = target;
        elevator.status = target > floor ? 'up' : 'down';
    }
};

/**
 * Execute a simulation step for all elevators.
 * 
 * This function simulates the movement of all elevators by one step. Each elevator's current floor
 * is adjusted based on its target floor and direction. If an elevator reaches its target floor,
 * it becomes idle and its target floor is cleared.
 */
export const step = (): void => {
    building.elevators.forEach(elevator => {
        if (elevator.targetFloor !== null && elevator.status !== 'off') {
            if (elevator.currentFloor < elevator.targetFloor) {
                elevator.currentFloor++;
                elevator.status = 'up';
            } else if (elevator.currentFloor > elevator.targetFloor) {
                elevator.currentFloor--;
                elevator.status = 'down';
            } else {
                // Elevator has reached the target floor
                elevator.status = 'idle';
                elevator.targetFloor = null;
            }
        }
    });
};

/**
 * Configure the building with a new number of floors and active elevators.
 * 
 * @param {number} numberOfFloors - The total number of floors in the building.
 * @param {number} activeElevators - The number of elevators that are active and in use.
 * 
 * This function updates the building's configuration and sets the status of elevators accordingly.
 */
export const configureBuilding = (numberOfFloors: number, activeElevators: number): void => {
    building.updateConfig(numberOfFloors, activeElevators);
};
