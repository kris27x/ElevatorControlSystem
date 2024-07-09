/**
 * Interface representing an Elevator.
 * 
 * @property {number} id - Unique identifier for the elevator.
 * @property {number} currentFloor - Current floor where the elevator is located.
 * @property {number | null} targetFloor - Target floor to which the elevator is moving.
 * @property {'up' | 'down' | 'idle' | 'off'} status - Current status of the elevator.
 * - 'up' indicates the elevator is moving up.
 * - 'down' indicates the elevator is moving down.
 * - 'idle' indicates the elevator is ready and waiting.
 * - 'off' indicates the elevator is not in use and cannot be selected.
 */
export interface Elevator {
    id: number;
    currentFloor: number;
    targetFloor: number | null;
    status: 'up' | 'down' | 'idle' | 'off';
}
