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
import LoginScreen from '@/pages/auth/LoginScreen';
import SignupScreen from '@/pages/auth/SignupScreen';
import SignupTermsScreen from '@/pages/auth/SignupTermsScreen';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* 헤더/푸터 없는 화면 */}
            <Route path='/' element={<SplashScreen />} />
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/auth/login' element={<LoginScreen />} />
            <Route path='/auth/signup/terms' element={<SignupTermsScreen />} />
            <Route path='/auth/signup' element={<SignupScreen />} />
            <Route path='/game/:mapId/:stageId' element={<InGameScreen />} />
            <Route path='/result' element={<ResultScreen />} />

            {/* 헤더/푸터 있는 화면 */}
            <Route element={<MainLayout />}>
                <Route path='/main' element={<MainScreen />} />
                <Route path='/stage-select/:mapId' element={<StageSelectScreen />} />
                <Route path='/collection' element={<CollectionScreen />} />
                <Route path='/inventory' element={<InventoryScreen />} />
                <Route path='/shop' element={<ShopScreen />} />
                <Route path='/settings' element={<SettingsScreen />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
