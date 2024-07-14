import { Elevator } from '../models/elevator';

/**
 * Selects the best possible elevator for a call.
 * 
 * @param {Elevator[]} elevators - Array of elevators to choose from.
 * @param {number} callFloor - The floor from which the call is made.
 * @param {number} direction - The direction of the call (up or down).
 * @returns {Elevator | null} - The best elevator for the call or null if no suitable elevator is found.
 */
export const selectBestElevator = (elevators: Elevator[], callFloor: number, direction: number): Elevator | null => {
    let bestElevator: Elevator | null = null;
    let minDistance = Infinity;

    // Priority 1: Elevators already targeting the call floor and moving in the same direction
    for (const elevator of elevators) {
        if (elevator.status === 'off') continue;

        const distance = Math.abs(elevator.currentFloor - callFloor);
        const isMovingTowardsCall = (elevator.status === 'up' && direction === 1 && elevator.currentFloor < callFloor) ||
                                    (elevator.status === 'down' && direction === -1 && elevator.currentFloor > callFloor);
        
        if (elevator.targetFloors.includes(callFloor) && isMovingTowardsCall && distance < minDistance) {
            minDistance = distance;
            bestElevator = elevator;
        }
    }

    if (bestElevator) return bestElevator;

    // Priority 2: Idle elevators
    bestElevator = null;
    minDistance = Infinity;

    for (const elevator of elevators) {
        if (elevator.status === 'off') continue;

        const distance = Math.abs(elevator.currentFloor - callFloor);
        
        if (elevator.status === 'idle' && distance < minDistance) {
            minDistance = distance;
            bestElevator = elevator;
        }
    }

    if (bestElevator) return bestElevator;

    // Priority 3: Elevators moving towards the call floor
    bestElevator = null;
    minDistance = Infinity;

    for (const elevator of elevators) {
        if (elevator.status === 'off') continue;

        const distance = Math.abs(elevator.currentFloor - callFloor);
        const isMovingTowardsCall = (elevator.status === 'up' && elevator.currentFloor < callFloor && direction === 1) ||
                                    (elevator.status === 'down' && elevator.currentFloor > callFloor && direction === -1);

        if (isMovingTowardsCall && distance < minDistance) {
            minDistance = distance;
            bestElevator = elevator;
        }
    }

    if (bestElevator) return bestElevator;

    // Priority 4: Closest elevators not moving away
    bestElevator = null;
    minDistance = Infinity;

    for (const elevator of elevators) {
        if (elevator.status === 'off') continue;

        const distance = Math.abs(elevator.currentFloor - callFloor);
        const isNotMovingAway = (elevator.status === 'idle') ||
                                (elevator.status === 'up' && elevator.currentFloor < callFloor) ||
                                (elevator.status === 'down' && elevator.currentFloor > callFloor);

        if (isNotMovingAway && distance < minDistance) {
            minDistance = distance;
            bestElevator = elevator;
        }
    }

    if (bestElevator) return bestElevator;

    // Final Fallback: Choose the closest elevator even if it's moving away
    bestElevator = null;
    minDistance = Infinity;

    for (const elevator of elevators) {
        if (elevator.status === 'off') continue;

        const distance = Math.abs(elevator.currentFloor - callFloor);

        if (distance < minDistance) {
            minDistance = distance;
            bestElevator = elevator;
        }
    }

    return bestElevator;
};
