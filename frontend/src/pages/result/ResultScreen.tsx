import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { RewardAnimation } from '@/components/game/RewardAnimation';
import { postReward } from '@/api/game';
import { checkStageClear } from '@/api/stages';
import { stageRewards } from '@/constants/stageRewards';
import { Reward } from '@/types/reward';

// 이미지는 직접 경로로 사용 (다른 컴포넌트들과 일관성 유지)

interface GameResult {
    success: boolean;
    message: string;
    email: string;
    stageIdx: number;
    successYn: string;
    mapIdx: string;
}

const ResultContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
    background: linear-gradient(135deg, rgb(226, 118, 41) 0%, rgb(194, 116, 61) 50%, #cd853f 100%);
    position: relative;
    overflow: hidden;
`;

const ResultCardContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ResultIcon = styled.img`
    width: 8rem;
    height: 8rem;
    object-fit: contain;
    margin-bottom: -1rem;
    z-index: 10;
    position: relative;
    filter: drop-shadow(0 4px 8px rgba(139, 69, 19, 0.3));
`;

const ResultCard = styled.div`
    background: linear-gradient(145deg, #f5f5dc 0%, #fff8dc 50%, #fffacd 100%),
        radial-gradient(circle at 30% 30%, rgba(139, 69, 19, 0.05) 0%, transparent 50%);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 40px 20px 24px 20px;
    box-shadow: 0 15px 30px rgba(139, 69, 19, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8),
        inset 0 -1px 0 rgba(139, 69, 19, 0.1);
    text-align: center;
    max-width: 420px;
    width: 90%;
    border: 2px solid rgba(139, 69, 19, 0.3);
    max-height: 85vh;
    overflow-y: auto;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(139, 69, 19, 0.02) 2px,
            rgba(139, 69, 19, 0.02) 4px
        );
        border-radius: 18px;
        pointer-events: none;
    }
`;

const ResultTitle = styled.h1`
    font-size: clamp(24px, 4vw, 28px);
    margin-bottom: 6px;
    color: #8b4513;
    font-weight: 800;
    text-shadow: 0 2px 4px rgba(139, 69, 19, 0.3), 0 1px 0 rgba(255, 255, 255, 0.8);
    position: relative;
    z-index: 1;
`;

const ResultSubtitle = styled.p`
    font-size: clamp(16px, 2.5vw, 18px);
    margin-bottom: 20px;
    color: #a0522d;
    font-weight: 600;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6);
    position: relative;
    z-index: 1;
`;

const RewardsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin: 20px 0;
    width: 100%;

    @media (min-width: 400px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

const RewardCard = styled.div`
    background: url('/assets/img/items/background.png') center/cover no-repeat;
    background-size: 100% 100%;
    border-radius: 0;
    padding: 2rem 2rem;
    border: none;
    box-shadow: none;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 120px;
    justify-content: center;
    position: relative;

    &:hover {
        transform: translateY(-2px);
        filter: brightness(1.1);
    }
`;

const RewardIcon = styled.img`
    width: 2.5rem;
    height: 2.5rem;
    object-fit: contain;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
`;

const RewardName = styled.div`
    font-size: 0.7rem;
    font-weight: 600;
    color: #8b4513;
    text-align: center;
    line-height: 1.2;
    min-height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    word-break: keep-all;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
`;

const RewardValue = styled.div`
    font-size: 0.7rem;
    font-weight: 700;
    color: #228b22;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.6);
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 20px;
    justify-content: center;
`;

const Button = styled.button`
    padding: 10px 20px;
    font-size: 0.75rem;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 3px 8px rgba(76, 175, 80, 0.3);
    min-width: 110px;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
        background: linear-gradient(135deg, #45a049 0%, #4caf50 100%);
    }

    &:active {
        transform: translateY(0);
    }
`;

const ResultScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [gameResult, setGameResult] = useState<GameResult | null>(null);
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [isRewardComplete, setIsRewardComplete] = useState(false);

    useEffect(() => {
        const locationState = location.state;
        if (!locationState) {
            navigate('/');
            return;
        }

        const result = typeof locationState === 'string' ? JSON.parse(locationState) : locationState;
        setGameResult(result);

        // 게임 성공 시 보상 설정
        if (result.success && result.successYn === 'Y') {
            const stageReward = stageRewards[result.stageIdx];
            if (stageReward) {
                console.log('🎁 스테이지 보상 설정:', stageReward);
                setRewards(stageReward);

                // 보상 지급 API 호출
                giveRewards(result.email, stageReward);
            } else {
                console.warn('⚠️ 스테이지 보상 정보 없음:', result.stageIdx);
            }
        } else {
            console.log('❌ 게임 실패로 보상 없음');
        }
    }, [location, navigate]);

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

    const handleNextStage = async () => {
        if (!gameResult) return;

        try {
            const response = await checkStageClear(gameResult.stageIdx, gameResult.email);

            if (response.is_final_stage === 'Y') {
                // 다음 맵의 스테이지 선택 화면으로 이동
                const nextMapIdx = Number(gameResult.mapIdx) + 1;
                navigate('/main', { state: { selectedMap: nextMapIdx } });
            } else {
                const nextStageIdx = gameResult.stageIdx + 1;
                navigate(`/game/${gameResult.mapIdx}/${nextStageIdx}`);
            }
        } catch (error) {
            console.error('Error checking stage clear:', error);
            // 에러가 발생해도 다음 스테이지로 이동
            const nextStageIdx = gameResult.stageIdx + 1;
            console.log('Error occurred, moving to next stage:', nextStageIdx, 'with mapId:', gameResult.mapIdx);
            navigate(`/game/${gameResult.mapIdx}/${nextStageIdx}`);
        }
    };

    const handleRetry = () => {
        if (gameResult) {
            // 같은 맵, 같은 스테이지로 다시 이동
            navigate(`/game/${gameResult.mapIdx}/${gameResult.stageIdx}`);
        }
    };

    const handleStageSelect = () => {
        if (gameResult) {
            // 현재 게임하던 맵의 스테이지 선택 화면으로 이동
            navigate(`/stage-select/${gameResult.mapIdx}`);
        }
    };

    const handleMainMenu = () => {
        navigate('/');
    };

    if (!gameResult) {
        return <div>로딩 중...</div>;
    }

    return (
        <ResultContainer>
            <ResultCardContainer>
                <ResultIcon
                    src={
                        gameResult.success && gameResult.successYn === 'Y'
                            ? '/assets/img/profile/win.png'
                            : '/assets/img/profile/defeat.png'
                    }
                    alt={gameResult.success && gameResult.successYn === 'Y' ? '승리' : '패배'}
                />
                <ResultCard>
                    <ResultTitle>
                        {gameResult.success && gameResult.successYn === 'Y' ? '미션 완료!' : '미션 실패'}
                    </ResultTitle>
                    <ResultSubtitle>스테이지 {gameResult.stageIdx}</ResultSubtitle>

                    {rewards.length > 0 && (
                        <RewardsContainer>
                            {rewards.map((reward, idx) => (
                                <RewardCard key={idx}>
                                    <RewardIcon
                                        src={
                                            reward.type === 'POINT'
                                                ? '/assets/img/header/point.png'
                                                : reward.type === 'CASH'
                                                ? '/assets/img/header/cash.png'
                                                : reward.itemImg
                                                ? `/assets/img/items/${reward.itemImg}.png`
                                                : '/assets/img/items/default.png'
                                        }
                                        alt={reward.itemName || reward.type}
                                    />
                                    <RewardName>
                                        {reward.itemName ||
                                            (reward.type === 'POINT'
                                                ? '클리닝 포인트'
                                                : reward.type === 'CASH'
                                                ? '클리닝 캐시'
                                                : '아이템')}
                                    </RewardName>
                                    <RewardValue>+{reward.value}</RewardValue>
                                </RewardCard>
                            ))}
                        </RewardsContainer>
                    )}

                    <ButtonContainer>
                        {gameResult?.success && gameResult?.successYn === 'Y' ? (
                            <Button onClick={handleNextStage}>다음 스테이지</Button>
                        ) : (
                            <Button onClick={handleRetry}>다시하기</Button>
                        )}
                        <Button onClick={handleStageSelect}>스테이지 선택</Button>
                    </ButtonContainer>
                </ResultCard>
            </ResultCardContainer>
        </ResultContainer>
    );
};

export default ResultScreen;
