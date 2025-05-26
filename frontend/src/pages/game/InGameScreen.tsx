import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Stage, Layer, Circle } from 'react-konva';
import { useNavigate, useParams } from 'react-router-dom';
import SliceTrail from '@/components/game/SliceTrail';
import Pollutant from '@/components/game/Pollutant';
import GameBackground from '@/components/game/GameBackground';
import GamePreparationModal from '@/components/game/GamePreparationModal';
import LoadingScreen from '@/components/common/LoadingScreen';
import TransitionWrapper from '@/components/common/TransitionWrapper';
import Matter from 'matter-js';
import {
    startGame,
    completeGame,
    getStagePollutions,
    getEquippedItems,
    getStageConfig,
    getGameItemEffects,
    processGameCompletion,
} from '@/api/game';
import { PollutionData, StagePollutionsResponse } from '@/api/stages';
import { useAuth } from '@/hooks/useAuth';

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;

    /* 처치 알림 애니메이션 */
    @keyframes fadeInOut {
        0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px) scale(0.8);
        }
        20% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1.1);
        }
        80% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateX(-50%) translateY(20px) scale(0.8);
        }
    }
`;

const GameUI = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
`;

const SettingsButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 100;

    &:hover {
        background: rgba(255, 255, 255, 0.3);
    }
`;

const Score = styled.div`
    position: absolute;
    top: 1rem;
    right: 1rem;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.5rem;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    background: rgba(0, 0, 0, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 20px;
`;

const Timer = styled.div`
    position: absolute;
    top: 1rem;
    left: 1rem;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.5rem;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    background: rgba(0, 0, 0, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 20px;
`;

const Lives = styled.div`
    position: absolute;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    color: ${({ theme }) => theme.colors.error.main};
    font-size: 1.5rem;
    background: rgba(0, 0, 0, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 20px;
`;

// ===== 게임 로직 개선을 위한 새로운 인터페이스 =====

/**
 * 확장된 오염물질 정보 (DB 데이터 기반)
 * - 기존 PollutantBody에 DB 오염물질 정보를 결합
 */
interface EnhancedPollutantBody extends PollutantBody {
    pollutionData: PollutionData; // DB에서 가져온 오염물질 정보
    baseScore: number; // 기본 점수 (DB 확장 필요)
    moveSpeed: number; // 이동 속도 (DB 확장 필요)
    sizeMultiplier: number; // 크기 배수 (DB 확장 필요)
    spawnWeight: number; // 생성 가중치 (DB 확장 필요)
}

/**
 * 아이템 효과 정보
 * - 장착된 아이템의 게임 내 효과를 정의
 */
interface ItemEffect {
    effectType: 'SCORE_BOOST' | 'TIME_EXTEND' | 'LIFE_BOOST' | 'COMBO_BOOST' | 'SLOW_TIME';
    effectValue: number; // 효과 수치
    effectDuration?: number; // 지속 시간 (초, 영구 효과는 undefined)
    isActive: boolean; // 현재 활성화 상태
    remainingTime?: number; // 남은 지속 시간
}

/**
 * 게임 설정 정보 (스테이지별)
 * - DB 확장 필요: game_stage_config 테이블
 */
interface StageGameConfig {
    stageIdx: number;
    timeLimit: number; // 제한 시간
    initialLives: number; // 초기 생명력
    pollutantSpawnRate: number; // 오염물질 생성 주기 (초)
    maxPollutants: number; // 최대 동시 오염물질 수
    difficultyMultiplier: number; // 난이도 배수
}

/**
 * 수집 데이터 추적 정보
 */
interface CollectionTracker {
    destroyedPollutants: Map<number, number>; // polIdx -> 처치 횟수
    totalScore: number;
    maxCombo: number;
    gameStartTime: number;
    itemEffectsUsed: ItemEffect[];
}

// ===== 기존 오염물질 정보 타입 (현재 사용 중) =====
interface PollutantBody {
    id: number;
    x: number;
    y: number;
    angle: number;
    radius: number;
    color: string;
    opacity: number;
    // 게임 로직 개선: 실제 오염물질 데이터 추가
    pollutionData?: PollutionData;
    pollutionImage?: string;
}

// 게임 결과 타입 정의
interface GameResult {
    score: number;
    stageId: number;
    timeSpent: number;
    pollutantsRemoved: number;
    maxCombo: number;
}

const InGameScreen: React.FC = () => {
    const navigate = useNavigate();
    const { stageId, mapId } = useParams<{ stageId: string; mapId: string }>();
    const { user, loading: authLoading } = useAuth();

    // 모든 state 선언
    const [score, setScore] = useState(0);
    const [slicePoints, setSlicePoints] = useState<number[]>([]);
    const [isSlicing, setIsSlicing] = useState(false);
    const [showPreparation, setShowPreparation] = useState(true);
    const [time, setTime] = useState(60);
    const [lives, setLives] = useState(3);
    const [isLoading, setIsLoading] = useState(true);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [pollutant, setPollutant] = useState<PollutantBody | null>(null);
    const [pollutantQueue, setPollutantQueue] = useState<PollutantBody[]>([]);
    const [gameEnded, setGameEnded] = useState(false);
    const [gameData, setGameData] = useState<{
        stageIdx: number | null;
        pollutions: any[];
    }>({
        stageIdx: null,
        pollutions: [],
    });
    const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    // ===== 게임 로직 개선을 위한 새로운 state =====
    const [itemEffects, setItemEffects] = useState<ItemEffect[]>([]);
    const [collectionTracker, setCollectionTracker] = useState<CollectionTracker>({
        destroyedPollutants: new Map(),
        totalScore: 0,
        maxCombo: 0,
        gameStartTime: Date.now(),
        itemEffectsUsed: [],
    });
    const [stageConfig, setStageConfig] = useState<StageGameConfig | null>(null);
    const [enhancedPollutantQueue, setEnhancedPollutantQueue] = useState<EnhancedPollutantBody[]>([]);

    // 처치 알림 상태
    const [killNotification, setKillNotification] = useState<{
        show: boolean;
        pollutionName: string;
        score: number;
    }>({ show: false, pollutionName: '', score: 0 });

    // 모든 ref 선언
    const startTime = useRef(Date.now());
    const stageRef = useRef<any>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const bodyRef = useRef<Matter.Body | null>(null);
    const animationRef = useRef<number | null>(null);

    // ===== 게임 로직 개선을 위한 핵심 함수들 =====

    /**
     * 스테이지 설정 로딩
     */
    const loadStageConfig = useCallback(
        async (stageIdx: number) => {
            try {
                const config = (await getStageConfig(stageIdx)) as any;
                setStageConfig(config);

                // 아이템 효과 적용된 설정 업데이트
                if (config && user?.email) {
                    const effects = (await getGameItemEffects(user.email)) as any;

                    // 시간 연장 효과 적용
                    if (effects?.TIME_EXTEND) {
                        setTime((config.timeLimit || 60) + effects.TIME_EXTEND);
                    } else {
                        setTime(config.timeLimit || 60);
                    }

                    // 생명력 부스트 효과 적용
                    if (effects?.LIFE_BOOST) {
                        setLives((config.initialLives || 3) + effects.LIFE_BOOST);
                    } else {
                        setLives(config.initialLives || 3);
                    }
                }
            } catch (error) {
                console.error('스테이지 설정 로딩 실패:', error);
                // 기본값 설정
                setTime(60);
                setLives(3);
            }
        },
        [user?.email],
    );

    /**
     * 1. 오염물질 생성 로직 개선
     * - DB 데이터를 기반으로 실제 오염물질 정보 사용
     * - 스테이지별 오염물질 타입과 속성 적용
     */
    const createEnhancedPollutantQueue = useCallback(
        (pollutions: PollutionData[], stageSize: { width: number; height: number }) => {
            const queue: EnhancedPollutantBody[] = [];
            const totalPollutants = Math.floor((stageSize.width * stageSize.height) / 50000);

            for (let i = 0; i < totalPollutants; i++) {
                // 가중치 기반으로 오염물질 타입 선택
                const selectedPollution = selectPollutionByWeight(pollutions);

                // TODO: DB 확장 후 실제 값 사용
                const baseScore = 100; // selectedPollution.baseScore || 100;
                const moveSpeed = 1 + Math.random() * 2; // selectedPollution.moveSpeed || (1 + Math.random() * 2);
                const sizeMultiplier = 1; // selectedPollution.sizeMultiplier || 1;

                const radius = (Math.random() * 20 + 30) * sizeMultiplier;
                const startX = stageSize.width * 0.2 + Math.random() * (stageSize.width * 0.6);
                const startY = 100;

                queue.push({
                    id: i,
                    x: startX,
                    y: startY,
                    angle: 0,
                    radius,
                    color: getPollutionColor(selectedPollution.type), // 타입별 색상
                    opacity: 1,
                    pollutionData: selectedPollution,
                    baseScore,
                    moveSpeed,
                    sizeMultiplier,
                    spawnWeight: 1, // selectedPollution.spawnWeight || 1
                });
            }

            return queue;
        },
        [],
    );

    /**
     * 가중치 기반 오염물질 선택
     */
    const selectPollutionByWeight = (pollutions: PollutionData[]): PollutionData => {
        // TODO: DB에 spawnWeight 추가 후 가중치 기반 선택 구현
        // 현재는 랜덤 선택
        return pollutions[Math.floor(Math.random() * pollutions.length)];
    };

    /**
     * 오염물질 타입별 색상 반환
     */
    const getPollutionColor = (type: string): string => {
        const colorMap: { [key: string]: string } = {
            plastic: '#FF6B6B', // 플라스틱 - 빨간색
            chemical: '#4ECDC4', // 화학물질 - 청록색
            organic: '#45B7D1', // 유기물 - 파란색
            metal: '#96CEB4', // 금속 - 녹색
            oil: '#FFEAA7', // 기름 - 노란색
            default: '#DDA0DD', // 기본 - 보라색
        };
        return colorMap[type] || colorMap['default'];
    };

    /**
     * 2. 아이템 효과 시스템
     * - 장착된 아이템의 게임 내 효과 적용
     */
    const initializeItemEffects = useCallback(async () => {
        if (!user?.email) return;

        try {
            // 장착된 아이템 조회 (이미 StageInfoModal에서 사용 중)
            const response = (await getEquippedItems(user.email)) as any;
            if (response && response.success && response.items) {
                const effects: ItemEffect[] = response.items.map((item: any) => {
                    // TODO: DB에 effect_type, effect_value, effect_duration 컬럼 추가 후 실제 값 사용
                    return createItemEffect(item);
                });

                setItemEffects(effects);
                applyItemEffects(effects);
            }
        } catch (error) {
            console.error('아이템 효과 초기화 실패:', error);
        }
    }, [user?.email]);

    /**
     * 아이템별 효과 생성
     */
    const createItemEffect = (item: any): ItemEffect => {
        // TODO: DB 확장 후 실제 아이템 효과 데이터 사용
        // 현재는 아이템 이름 기반으로 효과 추정
        const itemName = item.item.itemName.toLowerCase();

        if (itemName.includes('시간') || itemName.includes('time')) {
            return {
                effectType: 'TIME_EXTEND',
                effectValue: 10, // 10초 연장
                isActive: true,
            };
        } else if (itemName.includes('생명') || itemName.includes('life')) {
            return {
                effectType: 'LIFE_BOOST',
                effectValue: 1, // 생명력 1 증가
                isActive: true,
            };
        } else if (itemName.includes('점수') || itemName.includes('score')) {
            return {
                effectType: 'SCORE_BOOST',
                effectValue: 1.5, // 점수 1.5배
                isActive: true,
            };
        } else {
            return {
                effectType: 'COMBO_BOOST',
                effectValue: 1.2, // 콤보 점수 1.2배
                isActive: true,
            };
        }
    };

    /**
     * 아이템 효과 적용
     */
    const applyItemEffects = (effects: ItemEffect[]) => {
        effects.forEach((effect) => {
            if (!effect.isActive) return;

            switch (effect.effectType) {
                case 'TIME_EXTEND':
                    setTime((prev) => prev + effect.effectValue);
                    break;
                case 'LIFE_BOOST':
                    setLives((prev) => prev + effect.effectValue);
                    break;
                // SCORE_BOOST와 COMBO_BOOST는 점수 계산 시 적용
            }
        });
    };

    /**
     * 3. 수집 데이터 추적
     * - 처치한 오염물질 정보를 user_collection에 기록
     */
    const trackPollutantDestruction = useCallback((pollutant: EnhancedPollutantBody) => {
        setCollectionTracker((prev) => {
            const newMap = new Map(prev.destroyedPollutants);
            const polIdx = pollutant.pollutionData.polIdx;
            const currentCount = newMap.get(polIdx) || 0;
            newMap.set(polIdx, currentCount + 1);

            return {
                ...prev,
                destroyedPollutants: newMap,
            };
        });
    }, []);

    /**
     * 개선된 점수 계산 (아이템 효과 적용)
     */
    const calculateScore = useCallback(
        (pollutant: EnhancedPollutantBody, comboMultiplier: number = 1): number => {
            let baseScore = pollutant.baseScore;

            // 아이템 효과 적용
            itemEffects.forEach((effect) => {
                if (!effect.isActive) return;

                switch (effect.effectType) {
                    case 'SCORE_BOOST':
                        baseScore *= effect.effectValue;
                        break;
                    case 'COMBO_BOOST':
                        comboMultiplier *= effect.effectValue;
                        break;
                }
            });

            return Math.floor(baseScore * comboMultiplier);
        },
        [itemEffects],
    );

    // 모든 callback 선언
    const updateStageSize = useCallback(() => {
        if (stageRef.current) {
            const container = stageRef.current.container();
            const newSize = {
                width: container.offsetWidth || window.innerWidth,
                height: container.offsetHeight || window.innerHeight,
            };
            setStageSize(newSize);
        }
    }, []);

    // ===== 게임 로직 개선: 오염물질 처치 로직 =====
    const handlePollutantSlice = useCallback(() => {
        if (!pollutant || gameEnded) return;

        // 1. 개선된 점수 계산 (아이템 효과 적용)
        const comboMultiplier = 1 + combo * 0.1; // 콤보당 10% 추가
        let earnedScore = 100; // 기본 점수

        // 아이템 효과 적용
        itemEffects.forEach((effect) => {
            if (!effect.isActive) return;

            switch (effect.effectType) {
                case 'SCORE_BOOST':
                    earnedScore *= effect.effectValue;
                    break;
                case 'COMBO_BOOST':
                    // 콤보 보너스는 콤보 배수에 적용
                    break;
            }
        });

        const finalScore = Math.floor(earnedScore * comboMultiplier);

        // 2. 점수 및 콤보 업데이트
        setScore((prev) => prev + finalScore);
        setCombo((prev) => {
            const newCombo = prev + 1;
            setMaxCombo((prevMax) => Math.max(prevMax, newCombo));
            return newCombo;
        });

        // 3. 수집 데이터 추적 (게임 로직 개선)
        setCollectionTracker((prev) => {
            const newMap = new Map(prev.destroyedPollutants);

            // 실제 오염물질 데이터 사용
            const polIdx = (pollutant as any)?.pollutionData?.polIdx || 1;
            const currentCount = newMap.get(polIdx) || 0;
            newMap.set(polIdx, currentCount + 1);

            return {
                ...prev,
                destroyedPollutants: newMap,
                totalScore: prev.totalScore + finalScore,
                maxCombo: Math.max(prev.maxCombo, combo + 1),
            };
        });

        // 처치한 오염물질 정보 표시
        const pollutionInfo = (pollutant as any)?.pollutionData;
        console.log('🎯 오염물질 처치:', {
            pollutionName: pollutionInfo?.polName || '알 수 없음',
            pollutionType: pollutionInfo?.type || 'unknown',
            pollutionImage: pollutionInfo?.polImg1 || 'default.png',
            baseScore: 100,
            comboMultiplier,
            itemEffects: itemEffects.filter((e) => e.isActive),
            finalScore,
            newCombo: combo + 1,
        });

        // 처치 알림 표시
        if (pollutionInfo) {
            console.log(`✨ ${pollutionInfo.polName} 처치! +${finalScore}점`);

            // UI 알림 표시
            setKillNotification({
                show: true,
                pollutionName: pollutionInfo.polName,
                score: finalScore,
            });

            // 3초 후 알림 숨김
            setTimeout(() => {
                setKillNotification((prev) => ({ ...prev, show: false }));
            }, 3000);
        }

        // 4. 오염물질 제거
        setPollutant(null);
        if (bodyRef.current && engineRef.current) {
            Matter.World.remove(engineRef.current.world, bodyRef.current);
            bodyRef.current = null;
        }

        setTimeout(() => {
            if (!gameEnded) {
                setCurrentIndex((idx) => idx + 1);
            }
        }, 100);
    }, [pollutant, gameEnded, combo, itemEffects]);

    // ===== 게임 로직 개선: 게임 종료 및 데이터 저장 =====
    const endGame = useCallback(async () => {
        if (!user?.email || !gameData.stageIdx || gameEnded) return;
        setGameEnded(true);
        const isSuccess = lives > 0 && time > 0 && currentIndex >= pollutantQueue.length;
        const successYn = isSuccess ? 'Y' : 'N';

        try {
            // 1. 기존 게임 클리어 처리
            let retryCount = 0;
            let clearResponse;

            while (retryCount < 3) {
                try {
                    clearResponse = await completeGame(gameData.stageIdx, user.email, successYn);
                    if (clearResponse.success) break;
                } catch (error) {
                    console.error(`게임 종료 처리 시도 ${retryCount + 1} 실패:`, error);
                    retryCount++;
                    if (retryCount === 3) throw error;
                    await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
                }
            }

            if (!clearResponse) {
                throw new Error('게임 종료 처리 실패');
            }

            // 2. 게임 로직 개선: 수집 데이터 저장
            try {
                const defeatedPollutants: any[] = [];
                collectionTracker.destroyedPollutants.forEach((count, polIdx) => {
                    defeatedPollutants.push({
                        polIdx,
                        defeatedCount: count,
                        scoreGained: Math.floor(
                            collectionTracker.totalScore / collectionTracker.destroyedPollutants.size,
                        ),
                        maxCombo: collectionTracker.maxCombo,
                    });
                });

                if (defeatedPollutants.length > 0) {
                    await processGameCompletion(user.email, defeatedPollutants);
                    console.log('📊 수집 데이터 저장 완료:', defeatedPollutants);
                }
            } catch (error) {
                console.error('수집 데이터 저장 실패:', error);
                // 수집 데이터 저장 실패해도 게임은 계속 진행
            }

            const result = {
                score,
                stageIdx: gameData.stageIdx,
                timeSpent: Math.floor((Date.now() - startTime.current) / 1000),
                pollutantsRemoved: currentIndex,
                maxCombo,
                success: clearResponse.success,
                message: clearResponse.message,
                successYn: clearResponse.successYn,
                email: user.email,
                mapIdx: Number(mapId) || 1,
                // 게임 로직 개선: 추가 정보
                collectionData: {
                    destroyedPollutants: Array.from(collectionTracker.destroyedPollutants.entries()),
                    totalCollectionScore: collectionTracker.totalScore,
                    itemEffectsUsed: itemEffects.filter((e) => e.isActive),
                },
            };

            if (isSuccess) {
                localStorage.setItem('lastClearedStage', gameData.stageIdx.toString());
                localStorage.setItem('currentMapIdx', result.mapIdx.toString());
            }

            console.log('🏁 게임 종료:', result);

            setTimeout(() => {
                navigate('/result', { state: result });
            }, 1000);
        } catch (error) {
            console.error('게임 종료 처리 중 오류 발생:', error);
            // 에러 발생 시에도 결과 화면으로 이동
            navigate('/result', {
                state: {
                    score,
                    stageIdx: gameData.stageIdx,
                    timeSpent: Math.floor((Date.now() - startTime.current) / 1000),
                    pollutantsRemoved: currentIndex,
                    maxCombo,
                    success: false,
                    message: '게임 종료 처리 중 오류가 발생했습니다.',
                    email: user.email,
                    mapIdx: Number(mapId) || 1,
                },
            });
        }
    }, [
        gameData.stageIdx,
        lives,
        time,
        score,
        currentIndex,
        maxCombo,
        navigate,
        user?.email,
        pollutantQueue.length,
        mapId,
        gameEnded,
        collectionTracker,
        itemEffects,
    ]);

    // ===== 게임 로직 개선: 게임 초기화 함수 =====
    const initializeGame = async () => {
        if (!user?.email || !stageId) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);

            // 1. 게임 시작 API 호출
            const startResponse = await startGame(user.email, parseInt(stageId));
            if (!startResponse.success) {
                setIsLoading(false);
                return;
            }

            // 2. 스테이지별 오염물질 정보 조회 (게임 속성 포함)
            const pollutionsResponse = (await getStagePollutions(parseInt(stageId))) as StagePollutionsResponse;
            if (!pollutionsResponse || !pollutionsResponse.success) {
                setIsLoading(false);
                return;
            }

            console.log('🎮 오염물질 데이터 로딩 완료:', pollutionsResponse.pollutionsList);

            // 3. 스테이지별 게임 설정 로딩 (제한시간, 생명력 등)
            await loadStageConfig(parseInt(stageId));

            // 4. 아이템 효과 초기화
            await initializeItemEffects();

            // 5. 게임 데이터 설정 (순서 중요!)
            setGameData({
                stageIdx: startResponse.stageIdx,
                pollutions: pollutionsResponse.pollutionsList || [],
            });

            console.log('🎮 게임 초기화 완료:', {
                stageIdx: startResponse.stageIdx,
                pollutionsCount: pollutionsResponse.pollutionsList?.length || 0,
                userEmail: user.email,
            });
        } catch (error) {
            console.error('게임 초기화 중 오류 발생:', error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    // 모든 effect 선언
    useEffect(() => {
        if (!authLoading && !user) {
            console.error('사용자 정보가 없습니다. 메인 화면으로 이동합니다.');
            navigate('/main');
        }
    }, [user, authLoading, stageId, mapId, navigate]);

    useEffect(() => {
        updateStageSize();
        window.addEventListener('resize', updateStageSize);
        return () => window.removeEventListener('resize', updateStageSize);
    }, [updateStageSize]);

    useEffect(() => {
        if (showPreparation) return;

        // ===== 게임 로직 개선: 실제 오염물질 데이터 기반 생성 =====
        // 오염물질 데이터가 로딩될 때까지 대기
        if (!gameData.pollutions || gameData.pollutions.length === 0) {
            console.log('⏳ 오염물질 데이터 로딩 중...');
            return;
        }

        console.log('🎮 오염물질 큐 생성 시작:', gameData.pollutions);

        const { width, height } = stageSize;
        const totalPollutants = Math.floor((width * height) / 50000);
        const queue: PollutantBody[] = [];

        for (let i = 0; i < totalPollutants; i++) {
            // 실제 오염물질 데이터에서 랜덤 선택
            const selectedPollution = gameData.pollutions[Math.floor(Math.random() * gameData.pollutions.length)];

            const radius = Math.random() * 20 + 30;
            const startX = width * 0.2 + Math.random() * (width * 0.6);
            const startY = 100;

            // 오염물질 타입별 색상 적용
            const color = getPollutionColor(selectedPollution.type);

            console.log(`🎯 오염물질 ${i} 생성:`, {
                name: selectedPollution.polName,
                type: selectedPollution.type,
                image: selectedPollution.polImg1,
                color,
            });

            queue.push({
                id: i,
                x: startX,
                y: startY,
                angle: 0,
                radius,
                color,
                opacity: 1,
                // 실제 오염물질 데이터 추가
                pollutionData: selectedPollution,
                pollutionImage: selectedPollution.polImg1, // 이미지 정보 추가
            });
        }

        setPollutantQueue(queue);
        setCurrentIndex(0);
        console.log('✅ 오염물질 큐 생성 완료:', queue.length);
    }, [stageSize, showPreparation, gameData.pollutions]);

    useEffect(() => {
        if (showPreparation || gameEnded) return;
        if (!pollutantQueue.length) return;
        // 게임 종료 확인
        if (currentIndex >= pollutantQueue.length) {
            endGame();
            return;
        }

        // 엔진 생성
        const engine = Matter.Engine.create({ gravity: { x: 0, y: 0.3 } }); // 중력 약하게 조정
        engineRef.current = engine;
        const world = engine.world;

        // 현재 오염물질 바디 생성
        const p = pollutantQueue[currentIndex];
        if (!p) return;

        const body = Matter.Bodies.circle(p.x, p.y, p.radius, {
            restitution: 0.6,
            friction: 0.1,
            density: 0.001,
            velocity: {
                x: Math.random() * 4 - 2, // 좌우 속도 감소
                y: 1 + Math.random() * 2, // 아래로 떨어지는 속도 조정
            },
        });
        bodyRef.current = body;
        Matter.World.add(world, body);
        setPollutant({ ...p });

        // 애니메이션 루프
        const animate = () => {
            if (!bodyRef.current) return;
            Matter.Engine.update(engine, 1000 / 60);
            setPollutant((prev) =>
                prev && bodyRef.current
                    ? {
                          ...prev,
                          x: bodyRef.current.position.x,
                          y: bodyRef.current.position.y,
                          angle: bodyRef.current.angle,
                      }
                    : prev,
            );
            // 화면 아래로 벗어나면
            if (bodyRef.current.position.y - p.radius > stageSize.height) {
                console.log('Pollutant fell off screen:', bodyRef.current.position.y);
                setLives((prev) => {
                    const newLives = Math.max(prev - 1, 0);
                    if (newLives === 0) {
                        setTimeout(() => {
                            endGame();
                        }, 100);
                    }
                    return newLives;
                });
                setPollutant(null);
                Matter.World.remove(world, bodyRef.current);
                bodyRef.current = null;
                setTimeout(() => {
                    if (!gameEnded) {
                        setCurrentIndex((idx) => idx + 1);
                    }
                }, 800); // 다음 오염물질 등장 시간 증가
                return;
            }

            // 화면 밖으로 너무 멀리 나가는 경우 방지
            if (
                bodyRef.current.position.x < -p.radius * 2 ||
                bodyRef.current.position.x > stageSize.width + p.radius * 2
            ) {
                // 화면 안으로 다시 들어오도록 힘을 가함
                Matter.Body.applyForce(bodyRef.current, bodyRef.current.position, {
                    x: bodyRef.current.position.x < 0 ? 0.005 : -0.005,
                    y: 0,
                });
            }

            animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (engineRef.current) Matter.Engine.clear(engineRef.current);
        };
    }, [pollutantQueue, currentIndex, stageSize.height, showPreparation, gameEnded]);

    useEffect(() => {
        if ((lives === 0 || time === 0 || currentIndex >= pollutantQueue.length) && !gameEnded) {
            endGame();
        }
    }, [lives, time, currentIndex, pollutantQueue.length, gameEnded, endGame]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!showPreparation && !gameEnded) {
            timer = setInterval(() => {
                setTime((prev) => {
                    if (prev <= 0) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showPreparation, gameEnded]);

    // 로딩 중이거나 사용자 정보가 없으면 로딩 화면 표시
    if (authLoading || !user) {
        return <LoadingScreen />;
    }

    // 스테이지별 배경 이미지 경로 생성
    const getStageBackground = (stageId: string) => {
        return `/assets/img/ingame/stage${stageId}.png`;
    };

    // 나머지 렌더링 로직
    return (
        <Container>
            <GameBackground backgroundImage={getStageBackground(stageId || '1')} />
            <GameUI>
                <SettingsButton
                    onClick={() => {
                        // TODO: 설정 모달 구현
                        console.log('설정 버튼 클릭');
                    }}
                >
                    <img
                        src='/src/assets/icons/settings.svg'
                        alt='설정'
                    />
                </SettingsButton>
                <Score>점수: {score}</Score>
                <Timer>시간: {time}</Timer>
                <Lives>
                    {Array.from({ length: lives }).map((_, index) => (
                        <span key={index}>❤️</span>
                    ))}
                </Lives>
                {combo > 1 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '4rem',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: '#4CAF50',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                            background: 'rgba(0, 0, 0, 0.3)',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                        }}
                    >
                        {combo}콤보!
                    </div>
                )}

                {/* 처치 알림 */}
                {killNotification.show && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '6rem',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: '#FFD700',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                            background: 'rgba(0, 0, 0, 0.8)',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '15px',
                            border: '2px solid #FFD700',
                            animation: 'fadeInOut 3s ease-in-out',
                            zIndex: 1000,
                        }}
                    >
                        ✨ {killNotification.pollutionName} 처치! +{killNotification.score}점
                    </div>
                )}

                {/* 게임 로직 개선: 확장된 게임 정보 표시 */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '1rem',
                        left: '1rem',
                        color: 'white',
                        fontSize: '0.8rem',
                        background: 'rgba(0, 0, 0, 0.7)',
                        padding: '0.8rem',
                        borderRadius: '8px',
                        minWidth: '200px',
                    }}
                >
                    <div>
                        🎯 오염물질: {currentIndex + 1}/{pollutantQueue.length || 0}
                    </div>
                    <div>📊 수집된 종류: {collectionTracker.destroyedPollutants.size}개</div>
                    <div>
                        🏆 총 처치:{' '}
                        {Array.from(collectionTracker.destroyedPollutants.values()).reduce((a, b) => a + b, 0)}개
                    </div>

                    {/* 현재 오염물질 정보 표시 */}
                    {pollutant && (pollutant as any)?.pollutionData && (
                        <div style={{ color: '#4CAF50', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                            🎯 현재: {(pollutant as any).pollutionData.polName}
                        </div>
                    )}
                    {itemEffects.filter((e) => e.isActive).length > 0 && (
                        <div>⚡ 활성 효과: {itemEffects.filter((e) => e.isActive).length}개</div>
                    )}
                    {stageConfig && (
                        <div>
                            ⚙️ 설정: {stageConfig.timeLimit}초/{stageConfig.initialLives}생명
                        </div>
                    )}
                </div>

                {/* 아이템 효과 표시 */}
                {itemEffects.filter((e) => e.isActive).length > 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '1rem',
                            right: '1rem',
                            color: 'white',
                            fontSize: '0.8rem',
                            background: 'rgba(76, 175, 80, 0.8)',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            minWidth: '150px',
                        }}
                    >
                        <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>⚡ 활성 효과</div>
                        {itemEffects
                            .filter((e) => e.isActive)
                            .map((effect, index) => (
                                <div
                                    key={index}
                                    style={{ fontSize: '0.7rem' }}
                                >
                                    {effect.effectType === 'SCORE_BOOST' &&
                                        `🎯 점수 ${(effect.effectValue * 100).toFixed(0)}%`}
                                    {effect.effectType === 'TIME_EXTEND' && `⏰ 시간 +${effect.effectValue}초`}
                                    {effect.effectType === 'LIFE_BOOST' && `❤️ 생명 +${effect.effectValue}개`}
                                    {effect.effectType === 'COMBO_BOOST' &&
                                        `🔥 콤보 ${(effect.effectValue * 100).toFixed(0)}%`}
                                    {effect.effectType === 'SLOW_TIME' && `🐌 슬로우 ${effect.effectValue}초`}
                                </div>
                            ))}
                    </div>
                )}
            </GameUI>
            {showPreparation && (
                <GamePreparationModal
                    isOpen={showPreparation}
                    onClose={() => setShowPreparation(false)}
                    onStart={async () => {
                        startTime.current = Date.now();
                        // 먼저 게임 데이터 초기화
                        await initializeGame();
                        // 그 다음 게임 시작
                        setShowPreparation(false);
                    }}
                    stageInfo={{
                        name: '스테이지 시작',
                        description: '준비되셨나요?',
                        difficulty: 'easy',
                    }}
                />
            )}
            <Stage
                ref={stageRef}
                width={stageSize.width}
                height={stageSize.height}
                style={{ width: '100%', height: '100%', touchAction: 'none' }}
                onMouseDown={(e) => {
                    if (gameEnded || showPreparation) return;
                    e.evt.preventDefault();
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const point = stage.getPointerPosition();
                    if (!point) return;
                    setIsSlicing(true);
                    setSlicePoints([point.x, point.y]);
                }}
                onMouseMove={(e) => {
                    if (gameEnded || showPreparation || !isSlicing) return;
                    e.evt.preventDefault();
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const point = stage.getPointerPosition();
                    if (!point) return;
                    setSlicePoints((prev) => [...prev, point.x, point.y]);

                    // 슬라이스가 현재 오염물질과 충돌하는지 확인
                    if (pollutant) {
                        const { x, y, radius } = pollutant;
                        const lastIdx = slicePoints.length;
                        if (lastIdx >= 4) {
                            const x1 = slicePoints[lastIdx - 4];
                            const y1 = slicePoints[lastIdx - 3];
                            const x2 = slicePoints[lastIdx - 2];
                            const y2 = slicePoints[lastIdx - 1];

                            // 선분과 원의 충돌 검사
                            const dx = x2 - x1;
                            const dy = y2 - y1;
                            const lineLength = Math.sqrt(dx * dx + dy * dy);

                            if (lineLength > 0) {
                                const distance = Math.abs((dy * x - dx * y + x2 * y1 - x1 * y2) / lineLength);

                                if (distance < radius) {
                                    handlePollutantSlice();
                                }
                            }
                        }
                    }
                }}
                onMouseUp={(e) => {
                    if (gameEnded || showPreparation) return;
                    e.evt.preventDefault();
                    if (!isSlicing) return;
                    setIsSlicing(false);

                    // 슬라이스 길이 계산
                    let length = 0;
                    for (let i = 0; i < slicePoints.length - 2; i += 2) {
                        const dx = slicePoints[i + 2] - slicePoints[i];
                        const dy = slicePoints[i + 3] - slicePoints[i + 1];
                        length += Math.sqrt(dx * dx + dy * dy);
                    }

                    // 점수 추가 (슬라이스 길이에 비례)
                    if (length > 50) {
                        setScore((prev) => prev + Math.floor(length / 10));
                    }

                    // 조금 시간이 지난 후 슬라이스 트레일 초기화
                    setTimeout(() => {
                        setSlicePoints([]);
                    }, 200);
                }}
                onTouchStart={(e) => {
                    if (gameEnded || showPreparation) return;
                    e.evt.preventDefault();
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const point = stage.getPointerPosition();
                    if (!point) return;
                    setIsSlicing(true);
                    setSlicePoints([point.x, point.y]);
                }}
                onTouchMove={(e) => {
                    if (gameEnded || showPreparation || !isSlicing) return;
                    e.evt.preventDefault();
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const point = stage.getPointerPosition();
                    if (!point) return;
                    setSlicePoints((prev) => [...prev, point.x, point.y]);

                    // 슬라이스가 현재 오염물질과 충돌하는지 확인
                    if (pollutant) {
                        const { x, y, radius } = pollutant;
                        const lastIdx = slicePoints.length;
                        if (lastIdx >= 4) {
                            const x1 = slicePoints[lastIdx - 4];
                            const y1 = slicePoints[lastIdx - 3];
                            const x2 = slicePoints[lastIdx - 2];
                            const y2 = slicePoints[lastIdx - 1];

                            // 선분과 원의 충돌 검사
                            const dx = x2 - x1;
                            const dy = y2 - y1;
                            const lineLength = Math.sqrt(dx * dx + dy * dy);

                            if (lineLength > 0) {
                                const distance = Math.abs((dy * x - dx * y + x2 * y1 - x1 * y2) / lineLength);

                                if (distance < radius) {
                                    handlePollutantSlice();
                                }
                            }
                        }
                    }
                }}
                onTouchEnd={(e) => {
                    if (gameEnded || showPreparation) return;
                    e.evt.preventDefault();
                    if (!isSlicing) return;
                    setIsSlicing(false);

                    // 슬라이스 길이 계산
                    let length = 0;
                    for (let i = 0; i < slicePoints.length - 2; i += 2) {
                        const dx = slicePoints[i + 2] - slicePoints[i];
                        const dy = slicePoints[i + 3] - slicePoints[i + 1];
                        length += Math.sqrt(dx * dx + dy * dy);
                    }

                    // 점수 추가 (슬라이스 길이에 비례)
                    if (length > 50) {
                        setScore((prev) => prev + Math.floor(length / 10));
                    }

                    // 조금 시간이 지난 후 슬라이스 트레일 초기화
                    setTimeout(() => {
                        setSlicePoints([]);
                    }, 200);
                }}
            >
                <Layer>
                    {/* 슬라이스 트레일 */}
                    {isSlicing && slicePoints.length >= 4 && <SliceTrail points={slicePoints} />}

                    {/* 오염물질 */}
                    {pollutant && (
                        <Pollutant
                            key={pollutant.id}
                            id={pollutant.id}
                            x={pollutant.x}
                            y={pollutant.y}
                            angle={pollutant.angle}
                            radius={pollutant.radius}
                            color={pollutant.color}
                            opacity={pollutant.opacity}
                            onRemove={handlePollutantSlice}
                            // 게임 로직 개선: 오염물질 이미지 정보 전달
                            pollutionImage={(pollutant as any)?.pollutionImage}
                            pollutionName={(pollutant as any)?.pollutionData?.polName}
                        />
                    )}

                    {/* 스테이지 경계선 표시 (디버깅용) */}
                    {/* 디버그 표시 - 항상 보이도록 수정 */}
                    <Circle
                        x={stageSize.width / 2}
                        y={stageSize.height / 2}
                        radius={5}
                        fill='red'
                    />
                </Layer>
            </Stage>
            <TransitionWrapper $isVisible={true}>
                <div />
            </TransitionWrapper>
        </Container>
    );
};

export default InGameScreen;
