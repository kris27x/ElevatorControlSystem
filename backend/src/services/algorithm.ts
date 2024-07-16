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
    let suitableElevators: Elevator[] = [];

    // Priority 1: Elevators already targeting the call floor and moving in the same direction
    for (const elevator of elevators) {
        if (elevator.status === 'off') continue;

        const isMovingTowardsCall = (elevator.status === 'up' && direction === 1 && elevator.currentFloor < callFloor) ||
                                    (elevator.status === 'down' && direction === -1 && elevator.currentFloor > callFloor);

        if (elevator.targetFloors.includes(callFloor) && isMovingTowardsCall) {
            suitableElevators.push(elevator);
        }
    }

    if (suitableElevators.length > 0) {
        return getBestElevatorBasedOnTargetDifference(suitableElevators);
    }

    // Priority 2: Elevators already targeting the call floor but not moving in the same direction
    suitableElevators = elevators.filter(elevator => elevator.targetFloors.includes(callFloor));

    if (suitableElevators.length > 1) {
        return getClosestElevator(suitableElevators, callFloor);
    }

    // Priority 3: Idle elevators
    suitableElevators = elevators.filter(elevator => elevator.status === 'idle');

    if (suitableElevators.length > 0) {
        return getClosestElevator(suitableElevators, callFloor);
    }

    // Priority 4: Elevators moving towards the call floor
    suitableElevators = elevators.filter(elevator => {
        if (elevator.status === 'off') return false;

        const isMovingTowardsCall = (elevator.status === 'up' && elevator.currentFloor < callFloor && direction === 1) ||
                                    (elevator.status === 'down' && elevator.currentFloor > callFloor && direction === -1);

        return isMovingTowardsCall;
    });

    if (suitableElevators.length > 0) {
        return getBestElevatorBasedOnTargetDifference(suitableElevators);
    }

    // Priority 5: Closest elevators not moving away
    suitableElevators = elevators.filter(elevator => {
        if (elevator.status === 'off') return false;

        const isNotMovingAway = (elevator.status === 'idle') ||
                                (elevator.status === 'up' && elevator.currentFloor < callFloor) ||
                                (elevator.status === 'down' && elevator.currentFloor > callFloor);

        return isNotMovingAway;
    });

    if (suitableElevators.length > 0) {
        return getClosestElevator(suitableElevators, callFloor);
    }

    // Final Fallback: Choose the closest elevator even if it's moving away
    suitableElevators = elevators.filter(elevator => elevator.status !== 'off');

    return getClosestElevator(suitableElevators, callFloor);
};

/**
 * Get the best elevator based on the target floor difference condition.
 * 
 * @param {Elevator[]} suitableElevators - Array of suitable elevators.
 * @returns {Elevator | null} - The best elevator based on the target difference condition.
 */
const getBestElevatorBasedOnTargetDifference = (suitableElevators: Elevator[]): Elevator | null => {
    suitableElevators.sort((a, b) => a.targetFloors.length - b.targetFloors.length);
    
    for (let i = 0; i < suitableElevators.length; i++) {
        const currentElevator = suitableElevators[i];
        const nextElevator = suitableElevators[i + 1];

        if (nextElevator && (currentElevator.targetFloors.length - nextElevator.targetFloors.length > 2)) {
            return nextElevator;
        }

        return currentElevator;
    }

    return null;
};

/**
 * Get the closest elevator to the call floor.
 * 
 * @param {Elevator[]} suitableElevators - Array of suitable elevators.
 * @param {number} callFloor - The floor from which the call is made.
 * @returns {Elevator | null} - The closest elevator to the call floor.
 */
const getClosestElevator = (suitableElevators: Elevator[], callFloor: number): Elevator | null => {
    let bestElevator: Elevator | null = null;
    let minDistance = Infinity;

    for (const elevator of suitableElevators) {
        const distance = Math.abs(elevator.currentFloor - callFloor);
        if (distance < minDistance) {
            minDistance = distance;
            bestElevator = elevator;
        }
    }

    return bestElevator;
};
