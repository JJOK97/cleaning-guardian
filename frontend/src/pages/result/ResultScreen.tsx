import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { RewardAnimation } from '@/components/game/RewardAnimation';
import { postReward } from '@/api/game';
import { stageRewards } from '@/constants/stageRewards';
import { Reward } from '@/types/reward';

interface GameResult {
    success: boolean;
    message: string;
    email: string;
    stageIdx: number;
    successYn: string;
}

const ResultContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
    background: #f5f5f5;
`;

const ResultTitle = styled.h1`
    font-size: 32px;
    margin-bottom: 20px;
    color: #333;
`;

const ResultMessage = styled.p`
    font-size: 24px;
    margin-bottom: 30px;
    color: #666;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 20px;
    margin-top: 30px;
`;

const Button = styled.button`
    padding: 15px 30px;
    font-size: 18px;
    border: none;
    border-radius: 8px;
    background: #4caf50;
    color: white;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
        background: #45a049;
    }
`;

const ResultScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [gameResult, setGameResult] = useState<GameResult | null>(null);
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [isRewardComplete, setIsRewardComplete] = useState(false);

    useEffect(() => {
        const result = location.state as GameResult;
        console.log('ResultScreen result:', result);
        if (result) {
            setGameResult(result);
            if (result.success && result.successYn === 'Y') {
                const stageRewardList = stageRewards[result.stageIdx] || [];
                console.log('stageIdx:', result.stageIdx, 'stageRewardList:', stageRewardList);
                setRewards(stageRewardList);
                giveRewards(result.email, stageRewardList);
            }
        }
    }, [location]);

    const giveRewards = async (email: string, rewards: Reward[]) => {
        try {
            // 보상 지급 요청
            await postReward(email, rewards);
        } catch (error) {
            // 에러 처리
        }
    };

    const handleRewardComplete = () => {
        setIsRewardComplete(true);
    };

    const handleNextStage = () => {
        if (gameResult) {
            navigate(`/game/${gameResult.stageIdx + 1}`);
        }
    };

    const handleRetry = () => {
        if (gameResult) {
            navigate(`/game/${gameResult.stageIdx}`);
        }
    };

    const handleStageSelect = () => {
        navigate('/stage-select/1'); // 맵 ID는 1로 가정
    };

    if (!gameResult) {
        return <div>로딩 중...</div>;
    }

    return (
        <ResultContainer>
            <ResultTitle>{gameResult.success && gameResult.successYn === 'Y' ? '스테이지 클리어!' : '스테이지 실패'}</ResultTitle>
            <ResultMessage>스테이지 {gameResult.stageIdx}</ResultMessage>

            {rewards.length > 0 && (
                <div
                    style={{
                        width: '100%',
                        maxWidth: 900,
                        margin: '40px auto',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '24px',
                    }}
                >
                    {rewards.map((reward, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                fontSize: 'clamp(1.1rem, 2vw, 2rem)',
                                background: '#fff',
                                borderRadius: '16px',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                                padding: '16px 18px',
                                minWidth: 90,
                                maxWidth: 140,
                                width: '22vw',
                                boxSizing: 'border-box',
                            }}
                        >
                            <img
                                src={`/assets/rewards/${reward.itemImg || reward.type.toLowerCase()}.png`}
                                alt={reward.itemName || reward.type}
                                style={{
                                    width: 'clamp(40px, 8vw, 64px)',
                                    height: 'clamp(40px, 8vw, 64px)',
                                    marginBottom: 10,
                                    objectFit: 'contain',
                                }}
                            />
                            <div style={{ fontWeight: 'bold', marginBottom: 6, textAlign: 'center' }}>
                                {reward.itemName || (reward.type === 'POINT' ? '포인트' : reward.type === 'CASH' ? '캐시' : '아이템')}
                            </div>
                            <div style={{ color: '#4caf50' }}>+{reward.value}</div>
                        </div>
                    ))}
                </div>
            )}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                {gameResult?.success && gameResult?.successYn === 'Y' ? (
                    <Button onClick={handleNextStage}>다음 스테이지</Button>
                ) : (
                    <Button onClick={handleRetry}>다시하기</Button>
                )}
                <Button onClick={handleStageSelect}>스테이지 선택</Button>
            </div>
        </ResultContainer>
    );
};

export default ResultScreen;
