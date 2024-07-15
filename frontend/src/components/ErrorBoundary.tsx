import React, { Component, ReactNode } from 'react';
import { Alert, Container, Typography } from '@mui/material';

// Props interface for ErrorBoundary component
interface Props {
    children: ReactNode; // ReactNode allows any JSX as children
}

// State interface for ErrorBoundary component
interface State {
    hasError: boolean; // Indicates whether an error has occurred
}

/**
 * ErrorBoundary component to catch and display errors in its children components.
 * Renders an error message if any of its children throw an error.
 */
class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false }; // Initialize state with no errors
    }

    /**
     * Static method to update state when an error is caught.
     * @param error - The caught JavaScript error object.
     * @returns State object with hasError set to true.
     */
    static getDerivedStateFromError(_: Error): State {
        return { hasError: true }; // Update state to indicate error
    }

    /**
     * Handles the caught error and logs it to the console.
     * @param error - The caught JavaScript error object.
     * @param errorInfo - Information about the component stack that caused the error.
     */
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo); // Log the error to the console
    }

    render() {
        // If an error has occurred, render an error message
        if (this.state.hasError) {
            return (
                <Container>
                    <Alert severity="error">
                        <Typography variant="h6">Something went wrong.</Typography>
                        <Typography>Please try again later.</Typography>
                    </Alert>
                </Container>
            );
        }

        // If no error, render its children components
        return this.props.children;
    }
}

export default ErrorBoundary;
