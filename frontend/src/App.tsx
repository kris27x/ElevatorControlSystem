import React from 'react';
import HomePage from './pages/HomePage';
import './App.css';

/**
 * Main application component.
 * 
 * This component serves as the root of the React application. It renders the HomePage component,
 * which contains the main content and functionality of the elevator control system.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Elevator Control System</h1>
      </header>
      <main>
        <HomePage />
      </main>
    </div>
  );
};

export default App;
