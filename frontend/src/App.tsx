import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import SplashScreen from './pages/splash/SplashScreen';
import StageSelectScreen from './pages/main/StageSelectScreen';
import InGameScreen from './pages/game/InGameScreen';
import ResultScreen from './pages/result/ResultScreen';
import CollectionScreen from './pages/collection/CollectionScreen';
import InventoryScreen from './pages/inventory/InventoryScreen';
import ShopScreen from './pages/shop/ShopScreen';
import SettingsScreen from './pages/settings/SettingsScreen';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path='/'
                    element={<SplashScreen />}
                />
                <Route element={<MainLayout />}>
                    <Route
                        path='/main'
                        element={<StageSelectScreen />}
                    />
                    <Route
                        path='/game/:stageId'
                        element={<InGameScreen />}
                    />
                    <Route
                        path='/result'
                        element={<ResultScreen />}
                    />
                    <Route
                        path='/collection'
                        element={<CollectionScreen />}
                    />
                    <Route
                        path='/inventory'
                        element={<InventoryScreen />}
                    />
                    <Route
                        path='/shop'
                        element={<ShopScreen />}
                    />
                    <Route
                        path='/settings'
                        element={<SettingsScreen />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
