import { Elevator } from '../models/elevator';

/**
 * Sort elevator requests based on the current floor and direction of the elevator.
 * 
 * @param {number} currentFloor - The current floor of the elevator.
 * @param {'up' | 'down' | 'idle'} direction - The current direction of the elevator.
 * @param {number[]} targetFloors - List of target floors.
 * @returns {number[]} Sorted list of target floors.
 */
export function sortRequests(currentFloor: number, direction: 'up' | 'down' | 'idle' | 'off', targetFloors: number[]): number[] {
    if (direction === 'up') {
        // Sort target floors in ascending order if direction is 'up'
        targetFloors.sort((a, b) => {
            if (a >= currentFloor && b >= currentFloor) {
                return a - b;
            } else if (a >= currentFloor) {
                return -1;
            } else if (b >= currentFloor) {
                return 1;
            } else {
                return a - b;
            }
        });
    } else if (direction === 'down') {
        // Sort target floors in descending order if direction is 'down'
        targetFloors.sort((a, b) => {
            if (a <= currentFloor && b <= currentFloor) {
                return b - a;
            } else if (a <= currentFloor) {
                return -1;
            } else if (b <= currentFloor) {
                return 1;
            } else {
                return b - a;
            }
        });
    } else {
        // If idle, sort by closest floor first
        targetFloors.sort((a, b) => Math.abs(a - currentFloor) - Math.abs(b - currentFloor));
    }
    
    return targetFloors;
}

/**
 * Update the target floors of an elevator by sorting them based on the current floor and direction.
 * 
 * @param {Elevator} elevator - The elevator whose target floors need to be sorted.
 * @returns {Elevator} The updated elevator with sorted target floors.
 */
export function updateElevatorTargets(elevator: Elevator): Elevator {
    elevator.targetFloors = sortRequests(elevator.currentFloor, elevator.status, elevator.targetFloors);
    return elevator;
}
