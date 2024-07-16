import { Elevator } from '../models/elevator';
import { Building } from '../models/building';
import { updateElevatorTargets } from './priorityAlgo';
import { selectBestElevator } from './algorithm';

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
 * This function processes a pickup request by using the selectBestElevator function
 * to assign the best available elevator to the pickup request. The elevator's
 * target floor and status are updated accordingly.
 */
export const pickup = (floor: number, direction: number): void => {
    const bestElevator = selectBestElevator(building.elevators, floor, direction);
    if (bestElevator) {
        bestElevator.targetFloors.push(floor);
        updateStatus(bestElevator.id, bestElevator.currentFloor);
    } else {
        console.log('No suitable elevator found for pickup request');
    }
};

/**
 * Refresh the status of a specific elevator.
 * 
 * @param {number} id - The unique identifier of the elevator.
 * @param {number} floor - The current floor number of the elevator.
 * 
 * This function updates the status of a specific elevator. It sets the elevator's status 
 * based on the first target floor in the targetFloors array. If there are no targets, 
 * the status is set to 'idle'.
 */
export const updateStatus = (id: number, floor: number): void => {
    const elevator = building.elevators.find(e => e.id === id);
    if (elevator && elevator.status !== 'off' && elevator.targetFloors.length > 0) {
        const firstTarget = elevator.targetFloors[0];
        elevator.status = firstTarget > floor ? 'up' : 'down';
    } else if (elevator) {
        elevator.status = 'idle';
    }
};

/**
 * Add a target floor to a specific elevator.
 * 
 * @param {number} id - The unique identifier of the elevator.
 * @param {number} targetFloor - The target floor number to be added.
 * 
 * This function adds a target floor to the specified elevator's target floor list.
 */
export const addTarget = (id: number, targetFloor: number): void => {
    const elevator = building.elevators.find(e => e.id === id);
    if (elevator && elevator.status !== 'off') {
        elevator.targetFloors.push(targetFloor);
        updateStatus(elevator.id, elevator.currentFloor);
    }
};

/**
 * Execute a simulation step for all elevators.
 * 
 * This function simulates the movement of all elevators by one step. Each elevator's current floor
 * is adjusted based on its target floor and direction. If an elevator reaches its target floor,
 * it becomes idle and its target floor is cleared. All matching target floors are removed from the array.
 */
export const step = (): void => {
    building.elevators.forEach(elevator => {
        if (elevator.status !== 'off' && elevator.targetFloors.length > 0) {
            // Update the target floors using the priority algorithm
            updateElevatorTargets(elevator);
            const targetFloor = elevator.targetFloors[0];

            // Adjust elevator's current floor based on the sorted target
            if (elevator.currentFloor < targetFloor) {
                elevator.currentFloor++;
            } else if (elevator.currentFloor > targetFloor) {
                elevator.currentFloor--;
            }

            // Remove all matching target floors if reached
            if (elevator.currentFloor === targetFloor) {
                elevator.targetFloors = elevator.targetFloors.filter(floor => floor !== elevator.currentFloor);
            }

            // Set elevator status based on remaining targets
            if (elevator.targetFloors.length > 0) {
                elevator.status = elevator.currentFloor < elevator.targetFloors[0] ? 'up' : 'down';
            } else {
                elevator.status = 'idle';
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
    resetElevators(activeElevators); // Reset only active elevators to idle
};

/**
 * Reset all active elevators to the ground floor with no target and set inactive elevators to 'off'.
 * 
 * @param {number} activeElevators - The number of active elevators to reset.
 */
export const resetElevators = (activeElevators: number): void => {
    building.elevators.forEach((elevator, index) => {
        if (index < activeElevators) {
            elevator.currentFloor = 0;
            elevator.targetFloors = [];
            elevator.status = 'idle';
        } else {
            elevator.currentFloor = 0;
            elevator.targetFloors = [];
            elevator.status = 'off';
        }
    });
};

/**
 * Get the current building configuration.
 * 
 * @returns {{ numberOfFloors: number, activeElevators: number }} The current building configuration.
 */
export const getBuildingConfig = (): { numberOfFloors: number, activeElevators: number } => {
    return building.getConfig();
};
