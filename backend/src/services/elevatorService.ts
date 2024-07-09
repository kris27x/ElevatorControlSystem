import { Elevator } from '../models/elevator';

// Initialize 16 elevators with default values
const elevators: Elevator[] = Array.from({ length: 16 }, (_, id) => ({
    id,
    currentFloor: 0,
    targetFloor: null,
    direction: 'idle',
}));

/**
 * Get the status of all elevators.
 * 
 * @returns {Elevator[]} Array of elevator statuses.
 * 
 * This function returns the current status of all elevators in the system.
 * The status includes each elevator's ID, current floor, target floor, and direction.
 */
export const getStatus = (): Elevator[] => {
    return elevators;
};

/**
 * Handle a pickup request for an elevator.
 * 
 * @param {number} floor - The floor number where the pickup request is made.
 * @param {number} direction - The direction of the requested pickup (-1 for down, 1 for up).
 * 
 * This function processes a pickup request by assigning the first idle elevator
 * to the pickup request. The elevator's target floor and direction are updated accordingly.
 */
export const pickup = (floor: number, direction: number): void => {
    // Simplified algorithm to assign the first idle elevator to the pickup request
    const elevator = elevators.find(e => e.direction === 'idle');
    if (elevator) {
        elevator.targetFloor = floor;
        elevator.direction = direction === 1 ? 'up' : 'down';
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
 * target floor, and direction based on the provided parameters.
 */
export const update = (id: number, floor: number, target: number): void => {
    const elevator = elevators.find(e => e.id === id);
    if (elevator) {
        elevator.currentFloor = floor;
        elevator.targetFloor = target;
        elevator.direction = target > floor ? 'up' : 'down';
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
    elevators.forEach(elevator => {
        if (elevator.targetFloor !== null) {
            if (elevator.currentFloor < elevator.targetFloor) {
                elevator.currentFloor++;
                elevator.direction = 'up';
            } else if (elevator.currentFloor > elevator.targetFloor) {
                elevator.currentFloor--;
                elevator.direction = 'down';
            } else {
                // Elevator has reached the target floor
                elevator.direction = 'idle';
                elevator.targetFloor = null;
            }
        }
    });
};
