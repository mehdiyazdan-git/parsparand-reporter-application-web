// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import {AuthProvider} from "./hooks/useAuth";

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Dashboard />}>

                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
