/**
 * Interface representing an Elevator.
 * 
 * @property {number} id - Unique identifier for the elevator.
 * @property {number} currentFloor - Current floor where the elevator is located.
 * @property {number | null} targetFloor - Target floor to which the elevator is moving.
 * @property {'up' | 'down' | 'idle'} direction - Current direction of the elevator.
 */
export interface Elevator {
    id: number;
    currentFloor: number;
    targetFloor: number | null;
    direction: 'up' | 'down' | 'idle';
}
