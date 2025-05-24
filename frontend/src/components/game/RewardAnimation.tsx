import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { Reward } from '@/types/reward';

import pointIcon from '@/assets/img/header/point.png';
import cashIcon from '@/assets/img/header/cash.png';

const RewardContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
`;

const RewardItem = styled(motion.div)`
    background: rgba(0, 0, 0, 0.8);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    color: white;
    min-width: 200px;
`;

const RewardImage = styled.img`
    width: 64px;
    height: 64px;
    margin-bottom: 10px;
`;

const RewardText = styled.span`
    display: block;
    font-size: 24px;
    font-weight: bold;
`;

const PointReward = styled(RewardText)`
    color: #ffd700;
`;

const CashReward = styled(RewardText)`
    color: #00bfff;
`;

const ItemReward = styled(RewardText)`
    color: #98fb98;
`;

interface RewardAnimationProps {
    rewards: Reward[];
    onComplete: () => void;
}

export const RewardAnimation: React.FC<RewardAnimationProps> = ({ rewards, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (currentIndex < rewards.length) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setIsAnimating(false);
                setCurrentIndex((prev) => prev + 1);
            }, 1500);

            return () => clearTimeout(timer);
        } else {
            onComplete();
        }
    }, [currentIndex, rewards.length, onComplete]);

    const currentReward = rewards[currentIndex];

    return (
        <RewardContainer>
            <AnimatePresence>
                {isAnimating && currentReward && (
                    <RewardItem initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                        {currentReward.type === 'POINT' && (
                            <>
                                <RewardImage src={pointIcon} alt='포인트' />
                                <PointReward>+{currentReward.value} 포인트</PointReward>
                            </>
                        )}
                        {currentReward.type === 'CASH' && (
                            <>
                                <RewardImage src={cashIcon} alt='캐시' />
                                <CashReward>+{currentReward.value} 캐시</CashReward>
                            </>
                        )}
                        {currentReward.type === 'ITEM' && (
                            <>
                                <RewardImage src={currentReward.itemImg} alt={currentReward.itemName} />
                                <ItemReward>
                                    {currentReward.itemName} x{currentReward.value}
                                </ItemReward>
                            </>
                        )}
                    </RewardItem>
                )}
            </AnimatePresence>
        </RewardContainer>
    );
};
