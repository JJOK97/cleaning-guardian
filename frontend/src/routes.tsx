// routes.tsx 파일 수정
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import MainScreen from '@/pages/main/MainScreen';
import StageSelectScreen from '@/pages/stage-select/StageSelectScreen';
import InGameScreen from '@/pages/game/InGameScreen';
import ResultScreen from '@/pages/result/ResultScreen';
import CollectionScreen from '@/pages/collection/CollectionScreen';
import InventoryScreen from '@/pages/inventory/InventoryScreen';
import ShopScreen from '@/pages/shop/ShopScreen';
import SettingsScreen from '@/pages/settings/SettingsScreen';
import SplashScreen from '@/pages/splash/SplashScreen';

const AppRoutes: React.FC = () => {
    // 나머지 코드는 변경 없음
    return (
        <Routes>
            <Route
                path='/'
                element={<SplashScreen />}
            />
            <Route element={<MainLayout />}>
                <Route
                    path='/main'
                    element={<MainScreen />}
                />
                <Route
                    path='/stage-select/:mapId'
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
    );
};

export default AppRoutes;
