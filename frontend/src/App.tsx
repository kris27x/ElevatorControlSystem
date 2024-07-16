import React from 'react';
import HomePage from './pages/HomePage';
import { Container, CssBaseline, AppBar, Toolbar, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';

// Create a custom theme to enhance the UI appearance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 400,
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Elevator Control System
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <main>
          <HomePage />
        </main>
      </Container>
    </ThemeProvider>
  );
};

export default App;
