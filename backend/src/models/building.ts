/**
 * Interface representing the configuration of a building.
 * 
 * @property {number} numberOfFloors - The total number of floors in the building.
 * @property {number} activeElevators - The number of elevators that are active and in use.
 */
export interface BuildingConfig {
    numberOfFloors: number;
    activeElevators: number;
}

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

/**
 * Class representing a Building with configuration settings and elevators.
 */
export class Building {
    public config: BuildingConfig;
    public elevators: Elevator[];

    /**
     * Creates an instance of a Building.
     * 
     * @param {number} numberOfFloors - The total number of floors in the building.
     * @param {number} activeElevators - The number of elevators that are active and in use.
     */
    constructor(numberOfFloors: number, activeElevators: number) {
        this.config = {
            numberOfFloors,
            activeElevators
        };
        this.elevators = Array.from({ length: 16 }, (_, id) => ({
            id,
            currentFloor: 0,
            targetFloor: null,
            status: id < activeElevators ? 'idle' : 'off'
        }));
    }

    /**
     * Update the configuration of the building.
     * 
     * @param {number} numberOfFloors - The new total number of floors.
     * @param {number} activeElevators - The new number of active elevators.
     */
    updateConfig(numberOfFloors: number, activeElevators: number): void {
        this.config.numberOfFloors = numberOfFloors;
        this.config.activeElevators = activeElevators;

        // Update the status of elevators based on the active elevators count
        this.elevators.forEach((elevator, index) => {
            elevator.status = index < activeElevators ? 'idle' : 'off';
            if (index >= activeElevators) {
                elevator.targetFloor = null;
            }
        });
    }

    /**
     * Get the status of all elevators in the building.
     * 
     * @returns {Elevator[]} The current status of all elevators.
     */
    getElevatorStatus(): Elevator[] {
        return this.elevators;
    }
}
