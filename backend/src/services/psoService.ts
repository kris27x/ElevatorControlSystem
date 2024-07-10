import { Elevator } from '../models/elevator';

/**
 * Interface representing a Particle in the PSO algorithm.
 * 
 * @property {number} id - The unique identifier of the particle (elevator).
 * @property {number} position - The current position (floor) of the particle.
 * @property {number} velocity - The current velocity (change in floor) of the particle.
 * @property {number} bestPosition - The best position (floor) of the particle encountered so far.
 */
interface Particle {
    id: number;
    position: number;
    velocity: number;
    bestPosition: number;
    direction: 'up' | 'down' | 'idle' | 'off';
}

/**
 * Function to initialize particles for the PSO algorithm.
 * 
 * @param {Elevator[]} elevators - Array of elevators to be used as particles.
 * @returns {Particle[]} Array of initialized particles.
 */
const initializeParticles = (elevators: Elevator[]): Particle[] => {
    return elevators.map(elevator => ({
        id: elevator.id,
        position: elevator.currentFloor,
        velocity: 0,
        bestPosition: elevator.currentFloor,
        direction: elevator.status
    }));
};

/**
 * Objective function for the PSO algorithm.
 * 
 * @param {Particle} particle - The particle (elevator) being evaluated.
 * @param {number} targetFloor - The target floor for the pickup request.
 * @param {number} direction - The direction of the requested pickup.
 * @returns {number} The fitness score of the particle.
 * 
 * This function calculates the fitness score of a particle based on its distance
 * from the target floor, and prioritizes idle elevators and elevators moving in the desired direction.
 */
const objectiveFunction = (particle: Particle, targetFloor: number, direction: number): number => {
    let fitness = Math.abs(particle.position - targetFloor);

    if (particle.direction === 'idle') {
        fitness *= 0.5; // Prioritize idle elevators
    } else if ((direction === 1 && particle.direction === 'up') || (direction === -1 && particle.direction === 'down')) {
        fitness *= 0.75; // Prioritize elevators moving in the desired direction
    } else if ((direction === 1 && particle.direction === 'down') || (direction === -1 && particle.direction === 'up')) {
        fitness *= 1.5; // Penalize elevators moving in the opposite direction
    }

    return fitness;
};

/**
 * Function to update the velocity of a particle in the PSO algorithm.
 * 
 * @param {Particle} particle - The particle (elevator) being updated.
 * @param {number} globalBestPosition - The best position encountered by any particle.
 */
const updateVelocity = (particle: Particle, globalBestPosition: number): void => {
    const inertia = 0.5;
    const cognitiveComponent = 1.5;
    const socialComponent = 1.5;

    const r1 = Math.random();
    const r2 = Math.random();

    particle.velocity = inertia * particle.velocity +
                        cognitiveComponent * r1 * (particle.bestPosition - particle.position) +
                        socialComponent * r2 * (globalBestPosition - particle.position);
};

/**
 * Function to update the position of a particle in the PSO algorithm.
 * 
 * @param {Particle} particle - The particle (elevator) being updated.
 * @param {number} numberOfFloors - The total number of floors in the building.
 */
const updatePosition = (particle: Particle, numberOfFloors: number): void => {
    particle.position += particle.velocity;

    // Ensure the position is within the building's floor range
    if (particle.position < 0) {
        particle.position = 0;
    } else if (particle.position >= numberOfFloors) {
        particle.position = numberOfFloors - 1;
    }
};

/**
 * PSO algorithm to assign the best elevator for a pickup request.
 * 
 * @param {number} floor - The target floor for the pickup request.
 * @param {number} direction - The direction of the requested pickup (-1 for down, 1 for up).
 * @param {Elevator[]} elevators - The list of elevators.
 * @param {number} numberOfFloors - The total number of floors in the building.
 * @returns {Elevator | null} The best elevator for the pickup request, or null if none are suitable.
 * 
 * This function runs the PSO algorithm to find the best elevator to handle the pickup request.
 * It considers the current position and status of each elevator to minimize the waiting time
 * and travel distance.
 */
export const pso = (floor: number, direction: number, elevators: Elevator[], numberOfFloors: number): Elevator | null => {
    const accessibleElevators = elevators.filter(e => e.status !== 'off');
    const particles = initializeParticles(accessibleElevators);

    let globalBestPosition = particles[0].position;
    let globalBestScore = Infinity;

    for (let i = 0; i < 100; i++) { // 100 iterations for the PSO algorithm
        particles.forEach(particle => {
            const fitness = objectiveFunction(particle, floor, direction);

            if (fitness < globalBestScore) {
                globalBestScore = fitness;
                globalBestPosition = particle.position;
            }

            if (fitness < objectiveFunction(particle, particle.bestPosition, direction)) {
                particle.bestPosition = particle.position;
            }

            updateVelocity(particle, globalBestPosition);
            updatePosition(particle, numberOfFloors);
        });
    }

    const bestParticle = particles.find(p => p.position === globalBestPosition);
    return bestParticle ? elevators.find(e => e.id === bestParticle.id) || null : null;
};
