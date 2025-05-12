import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/main/SplashScreen';
import MainMapScreen from './pages/main/MainMapScreen';
import StageSelectScreen from './pages/main/StageSelectScreen';
import InGameScreen from './pages/game/InGameScreen';
import ResultScreen from './pages/game/ResultScreen';

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path='/'
                    element={<SplashScreen />}
                />
                <Route
                    path='/main'
                    element={<MainMapScreen />}
                />
                <Route
                    path='/stage'
                    element={<StageSelectScreen />}
                />
                <Route
                    path='/game'
                    element={<InGameScreen />}
                />
                <Route
                    path='/result'
                    element={<ResultScreen />}
                />
            </Routes>
        </Router>
    );
}

export default App;
