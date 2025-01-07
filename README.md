# ElevatorControlSystem

This project represents the Elevator Control System web application designed using TypeScript within React framework, Material-UI (MUI). Backend: Node.js with Express. Additional: Axios, Framer Motion.

[Google Drive Folder](https://drive.google.com/drive/folders/13qtaprY39Tnz28ngGs4u78II5qrzfP_K?usp=sharing)


******INSTALLATION******

1. Clone the repository
   
   git clone https://github.com/kris27x/ElevatorControlSystem.git
   
2. Navigate to the project directory
 
   cd ElevatorControlSystem
   
3. Install and run backend
   
   cd backend
   
   npm install
   
   npm start
   
4. Install and run frontend - open new terminal and navigate to the frontend directory
   
   cd frontend
   
   npm install
   
   npm start


**Code has been well-maintained and documented using JSDoc Comments & Annotations standard.**


****Project is based on two algorithms:****

***priorityAlgo.ts file*** - is a SCAN based sorting algorithm responsible targets sortation for each elevator. The sortRequests function sorts the target floors of an elevator based on its current direction and floor. If the elevator is moving up, it prioritizes floors above the current floor in ascending order. If moving down, it prioritizes floors below in descending order. If idle, it prioritizes the closest floors. The updateElevatorTargets function utilizes sortRequests to update the target floors of a given elevator, ensuring the elevator processes requests in an optimized order. This algorithm ensures efficient operation of the elevator, minimizing travel time and improving overall performance.

***algorithm.ts file*** - this generic algorithm is responsible for assigning each request to the best possible elevator. It consists of 5 priorities and fallback mechanism.
This elevator selection algorithm prioritizes elevators based on various criteria to efficiently handle elevator requests. The priorities ensure that elevators already targeting the call floor and moving in the same direction are chosen first, followed by those that are idle or moving towards the call floor. If no elevators meet these criteria, the closest elevator is selected, even if it means the elevator is moving away from the call floor. The helper functions getBestElevatorBasedOnTargetDifference and getClosestElevator assist in making these decisions by evaluating the suitability of the elevators based on target floor differences and proximity, respectively.

**Priority 1: Elevators Already Targeting the Call Floor and Moving in the Same Direction**

Iterate over all elevators.
Skip elevators that are 'off'.
Check if the elevator is moving towards the call floor.
If the elevator is moving in the same direction and is targeting the call floor, add it to suitableElevators.
If any elevators are found, return the one with the best target floor difference (via getBestElevatorBasedOnTargetDifference).

**Priority 2: Elevators Already Targeting the Call Floor but Not Moving in the Same Direction**

Filter elevators that have the call floor in their target floors.
If multiple elevators are found, return the closest one to the call floor (via getClosestElevator).

**Priority 3: Idle Elevators**

Filter elevators that are idle.
If any idle elevators are found, return the closest one to the call floor (via getClosestElevator).

**Priority 4: Elevators Moving Towards the Call Floor**

Filter elevators that are moving towards the call floor.
If any elevators are found, return the one with the best target floor difference (via getBestElevatorBasedOnTargetDifference).

**Priority 5: Closest Elevators Not Moving Away**

Filter elevators that are not moving away from the call floor.
If any elevators are found, return the closest one to the call floor (via getClosestElevator).

**Final Fallback: Closest Elevator Even If It's Moving Away**

Filter elevators that are not 'off'.
Return the closest elevator to the call floor (via getClosestElevator).
