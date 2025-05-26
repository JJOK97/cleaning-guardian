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

const Container = styled.div<{ $screenShake?: boolean }>`
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;

    /* 타격감 개선: 화면 진동 효과 */
    ${(props) =>
        props.$screenShake &&
        `
        animation: screenShake 0.1s ease-in-out;
    `}

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

    /* 화면 진동 애니메이션 */
    @keyframes screenShake {
        0%,
        100% {
            transform: translateX(0);
        }
        10% {
            transform: translateX(-3px) translateY(-2px);
        }
        20% {
            transform: translateX(3px) translateY(2px);
        }
        30% {
            transform: translateX(-2px) translateY(-1px);
        }
        40% {
            transform: translateX(2px) translateY(1px);
        }
        50% {
            transform: translateX(-1px) translateY(-1px);
        }
        60% {
            transform: translateX(1px) translateY(1px);
        }
        70% {
            transform: translateX(-1px) translateY(0);
        }
        80% {
            transform: translateX(1px) translateY(0);
        }
        90% {
            transform: translateX(0) translateY(-1px);
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

// 게임 상단 UI 컨테이너 (반응형)
const TopGameUI = styled.div`
    position: absolute;
    top: 0.7rem;
    left: 0.7rem;
    right: 0.7rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    z-index: 100;
    gap: 0.5rem;

    @media (max-width: 768px) {
        top: 0.5rem;
        left: 0.5rem;
        right: 0.5rem;
        gap: 0.5rem;
    }
`;

const LeftSection = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-start;
`;

const CenterSection = styled.div`
    display: flex;
    align-items: center;
    flex: 0 0 auto;
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
`;

const GameInfoCard = styled.div`
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 15px;
    padding: 0.8rem 1.2rem;
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
    min-width: fit-content;

    @media (max-width: 768px) {
        font-size: 1rem;
        padding: 0.6rem 1rem;
        border-radius: 12px;
        gap: 0.4rem;
    }

    @media (max-width: 480px) {
        font-size: 0.9rem;
        padding: 0.5rem 0.8rem;
        border-radius: 10px;
        gap: 0.3rem;
    }
`;

const Timer = styled(GameInfoCard)`
    color: #4caf50;
`;

const Score = styled(GameInfoCard)`
    color: #ffd700;
`;

const Lives = styled(GameInfoCard)`
    color: #ff6b6b;
`;

// 중앙 알림 영역
const CenterNotificationArea = styled.div`
    position: absolute;
    top: 4rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    z-index: 200;
    pointer-events: none;

    @media (max-width: 768px) {
        top: 3rem;
        gap: 0.3rem;
    }

    @media (max-width: 480px) {
        top: 2.5rem;
    }
`;

const ComboNotification = styled.div`
    background: rgba(76, 175, 80, 0.95);
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    border: 2px solid #4caf50;
    animation: pulse 0.6s ease-in-out;

    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }

    @media (max-width: 768px) {
        font-size: 1rem;
        padding: 0.4rem 0.8rem;
    }

    @media (max-width: 480px) {
        font-size: 0.9rem;
        padding: 0.3rem 0.6rem;
    }
`;

const KillNotification = styled.div`
    background: rgba(0, 0, 0, 0.9);
    color: #ffd700;
    font-size: 1rem;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
    padding: 0.6rem 1.2rem;
    border-radius: 15px;
    border: 2px solid #ffd700;
    animation: fadeInOut 3s ease-in-out;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 0.9rem;
        padding: 0.5rem 1rem;
    }

    @media (max-width: 480px) {
        font-size: 0.8rem;
        padding: 0.4rem 0.8rem;
    }
`;

const ScoreText = styled.div`
    color: #4caf50;
    font-size: 0.9em;
    margin-top: 0.2rem;
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
    // 스와이프 제한: 한 번만 처치되도록
    isSliced?: boolean;
    // 처치 상태 플래그 (생명력 깎지 않기 위함)
    isDefeated?: boolean;
    // 사방향 스폰 시스템: 초기 속도와 생성 방향 정보
    initialVelocity?: {
        x: number;
        y: number;
    };
    spawnSide?: number; // 0: 위, 1: 오른쪽, 2: 아래, 3: 왼쪽
    initialAngularVelocity?: number; // 초기 회전 속도
    // 게임 영역 도달 여부 (생명력 보호용)
    hasReachedGameArea?: boolean;
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
    const [sliceCount, setSliceCount] = useState(0); // 이번 스트로크에서 처치한 횟수
    const [showPreparation, setShowPreparation] = useState(true);
    const [time, setTime] = useState(60);
    const [lives, setLives] = useState(3);
    const [isLoading, setIsLoading] = useState(true);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [pollutant, setPollutant] = useState<PollutantBody | null>(null);
    const [pollutantQueue, setPollutantQueue] = useState<PollutantBody[]>([]);
    const [activePollutants, setActivePollutants] = useState<PollutantBody[]>([]); // 동시 스폰용
    const [activeBodies, setActiveBodies] = useState<Matter.Body[]>([]); // 물리 바디들
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
    const [gameStarted, setGameStarted] = useState(false); // 게임 실제 시작 여부

    // 처치 알림 상태
    const [killNotification, setKillNotification] = useState<{
        show: boolean;
        pollutionName: string;
        score: number;
    }>({ show: false, pollutionName: '', score: 0 });

    // 타격감 개선: 화면 진동 효과
    const [screenShake, setScreenShake] = useState(false);

    // 처치 상태 추적 (애니메이션 루프에서 접근 가능)
    const isDefeatedRef = useRef(false);

    // 중복 처리 방지
    const isProcessingNextRef = useRef(false);

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
                    try {
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
                    } catch (effectError) {
                        console.warn('아이템 효과 로딩 실패, 기본 설정 사용:', effectError);
                        setTime(config.timeLimit || 60);
                        setLives(config.initialLives || 3);
                    }
                } else {
                    setTime(60);
                    setLives(3);
                }
            } catch (error) {
                console.warn('스테이지 설정 로딩 실패, 기본값 사용:', error);
                // 기본값 설정
                setTime(60);
                setLives(3);
                setStageConfig({
                    stageIdx,
                    timeLimit: 60,
                    initialLives: 3,
                    pollutantSpawnRate: 2,
                    maxPollutants: 5,
                    difficultyMultiplier: 1,
                });
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

    // ===== 게임 로직 개선: 다중 오염물질 처치 로직 =====
    const handlePollutantSlice = useCallback(
        (targetPollutant?: PollutantBody) => {
            if (gameEnded || activePollutants.length === 0) {
                console.log('🚫 처치 차단:', { gameEnded, activePollutantsCount: activePollutants.length });
                return;
            }

            // 처치할 오염물질 찾기 (targetPollutant가 있으면 그것을, 없으면 첫 번째)
            let pollutantToSlice = targetPollutant;
            let bodyToSlice: Matter.Body | null = null;
            let pollutantIndex = -1;

            if (!pollutantToSlice) {
                // 스와이프와 충돌하는 오염물질 찾기
                for (let i = 0; i < activePollutants.length; i++) {
                    const p = activePollutants[i];
                    const body = activeBodies[i];
                    if (!p || !body || (body as any).isDefeated) continue;

                    // 스와이프 충돌 검사
                    if (slicePoints.length >= 4) {
                        const { x, y, radius } = p;
                        const lastIdx = slicePoints.length;
                        const x1 = slicePoints[lastIdx - 4];
                        const y1 = slicePoints[lastIdx - 3];
                        const x2 = slicePoints[lastIdx - 2];
                        const y2 = slicePoints[lastIdx - 1];

                        const dx = x2 - x1;
                        const dy = y2 - y1;
                        const lineLength = Math.sqrt(dx * dx + dy * dy);

                        if (lineLength > 0) {
                            const distance = Math.abs((dy * x - dx * y + x2 * y1 - x1 * y2) / lineLength);
                            if (distance < radius * 0.45) {
                                pollutantToSlice = p;
                                bodyToSlice = body;
                                pollutantIndex = i;
                                break;
                            }
                        }
                    }
                }
            } else {
                // targetPollutant가 지정된 경우 해당 인덱스 찾기
                pollutantIndex = activePollutants.findIndex((p) => p.id === targetPollutant!.id);
                if (pollutantIndex >= 0) {
                    bodyToSlice = activeBodies[pollutantIndex];
                }
            }

            if (!pollutantToSlice || !bodyToSlice || pollutantIndex < 0) {
                return;
            }

            // 이미 처치된 오염물질은 다시 처치하지 않음
            if ((bodyToSlice as any).isDefeated) {
                return;
            }

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

            // 3. 수집 데이터 추적
            setCollectionTracker((prev) => {
                const newMap = new Map(prev.destroyedPollutants);
                const polIdx = (pollutantToSlice as any)?.pollutionData?.polIdx || 1;
                const currentCount = newMap.get(polIdx) || 0;
                newMap.set(polIdx, currentCount + 1);

                return {
                    ...prev,
                    destroyedPollutants: newMap,
                    totalScore: prev.totalScore + finalScore,
                    maxCombo: Math.max(prev.maxCombo, combo + 1),
                };
            });

            // 4. 처치 상태 플래그 설정
            (bodyToSlice as any).isDefeated = true;

            // 5. 물리 효과: 회전하면서 날아가기
            if (slicePoints.length >= 4) {
                const lastIdx = slicePoints.length;
                const x1 = slicePoints[lastIdx - 4];
                const y1 = slicePoints[lastIdx - 3];
                const x2 = slicePoints[lastIdx - 2];
                const y2 = slicePoints[lastIdx - 1];

                const swipeDirection = {
                    x: x2 - x1,
                    y: y2 - y1,
                };

                const magnitude = Math.sqrt(swipeDirection.x * swipeDirection.x + swipeDirection.y * swipeDirection.y);
                if (magnitude > 0) {
                    swipeDirection.x /= magnitude;
                    swipeDirection.y /= magnitude;

                    const forceStrength = 0.05;
                    Matter.Body.applyForce(bodyToSlice, bodyToSlice.position, {
                        x: -swipeDirection.x * forceStrength,
                        y: -swipeDirection.y * forceStrength,
                    });

                    const angularVelocity = (Math.random() - 0.5) * 0.5;
                    Matter.Body.setAngularVelocity(bodyToSlice, angularVelocity);
                }
            }

            // 6. 타격감 효과
            setScreenShake(true);
            setTimeout(() => setScreenShake(false), 300);

            if (navigator.vibrate) {
                navigator.vibrate(30);
            }

            // 7. 처치 알림 표시
            const pollutionInfo = (pollutantToSlice as any)?.pollutionData;
            if (pollutionInfo) {
                console.log(`✨ ${pollutionInfo.polName} 처치! +${finalScore}점 (콤보 x${combo + 1})`);

                setKillNotification({
                    show: true,
                    pollutionName: pollutionInfo.polName,
                    score: finalScore,
                });

                setTimeout(() => {
                    setKillNotification((prev) => ({ ...prev, show: false }));
                }, 3000);
            }

            console.log('✨ 오염물질 처치 완료:', {
                pollutionName: pollutionInfo?.polName || '알 수 없음',
                finalScore,
                newCombo: combo + 1,
                activePollutantsCount: activePollutants.length,
            });
        },
        [gameEnded, activePollutants, activeBodies, combo, itemEffects, slicePoints],
    );

    // ===== 게임 로직 개선: 게임 종료 및 데이터 저장 =====
    const endGameRef = useRef(false); // 중복 호출 방지용 ref

    const endGame = useCallback(async () => {
        if (!user?.email || !gameData.stageIdx || gameEnded || endGameRef.current) {
            console.log('🚫 게임 종료 차단:', {
                hasUser: !!user?.email,
                hasStageIdx: !!gameData.stageIdx,
                gameEnded,
                alreadyEnding: endGameRef.current,
            });
            return;
        }

        console.log('🏁 게임 종료 시작');
        endGameRef.current = true; // 중복 호출 방지 플래그 설정
        setGameEnded(true);

        // 즉시 모든 애니메이션과 물리 엔진 정리
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        if (bodyRef.current && engineRef.current) {
            Matter.World.remove(engineRef.current.world, bodyRef.current);
            bodyRef.current = null;
        }
        if (engineRef.current) {
            Matter.Engine.clear(engineRef.current);
            engineRef.current = null;
        }
        setPollutant(null);

        const isSuccess = lives > 0 && time > 0 && currentIndex >= pollutantQueue.length;
        const successYn = isSuccess ? 'Y' : 'N';

        console.log('🎯 게임 종료 상태:', {
            isSuccess,
            successYn,
            lives,
            time,
            currentIndex,
            pollutantQueueLength: pollutantQueue.length,
        });

        try {
            // 1. 기존 게임 클리어 처리
            let retryCount = 0;
            let clearResponse;

            console.log('📡 게임 클리어 API 호출 시작:', {
                stageIdx: gameData.stageIdx,
                email: user.email,
                successYn,
            });

            while (retryCount < 3) {
                try {
                    clearResponse = await completeGame(gameData.stageIdx, user.email, successYn);
                    console.log('📡 게임 클리어 API 응답:', clearResponse);
                    if (clearResponse && clearResponse.success) break;
                } catch (error) {
                    console.error(`게임 종료 처리 시도 ${retryCount + 1} 실패:`, error);
                    retryCount++;
                    if (retryCount === 3) {
                        console.error('🚨 게임 클리어 API 최종 실패, 강제 진행');
                        // API 실패해도 게임 결과 화면으로 이동
                        clearResponse = {
                            success: false,
                            message: 'API 호출 실패',
                            successYn: successYn,
                        };
                        break;
                    }
                    await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
                }
            }

            if (!clearResponse) {
                console.error('🚨 clearResponse가 null, 기본값 설정');
                clearResponse = {
                    success: false,
                    message: '응답 없음',
                    successYn: successYn,
                };
            }

            // 2. 게임 로직 개선: 수집 데이터 저장 (API 없으면 스킵)
            console.log('📊 수집 데이터 저장 시작...');
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
                    console.log('📊 수집 데이터 API 호출 중... (2초 타임아웃)');
                    // 타임아웃 설정으로 무한 대기 방지 (2초로 단축)
                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('API 타임아웃')), 2000),
                    );

                    // 백그라운드에서 처리하고 즉시 진행하는 옵션
                    const savePromise = Promise.race([
                        processGameCompletion(user.email, defeatedPollutants),
                        timeoutPromise,
                    ]);

                    // 빠른 전환을 위해 백그라운드 처리 (await 제거)
                    savePromise
                        .then(() => console.log('📊 수집 데이터 저장 완료:', defeatedPollutants))
                        .catch((error) => console.warn('📊 백그라운드 수집 데이터 저장 실패:', error));

                    console.log('📊 수집 데이터 백그라운드 처리 시작, 즉시 진행');
                } else {
                    console.log('📊 수집 데이터 없음, 건너뛰기');
                }
            } catch (error) {
                console.warn('📊 수집 데이터 저장 실패, 게임 계속 진행:', error);
                // 수집 데이터 저장 실패해도 게임은 계속 진행
            }
            console.log('📊 수집 데이터 처리 완료 (2초 타임아웃)');

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
            console.log('🚀 결과 화면으로 이동 준비 완료');

            // 즉시 결과 화면으로 이동 (setTimeout 제거)
            console.log('🚀 결과 화면으로 이동 시작');
            endGameRef.current = false; // 플래그 리셋
            navigate('/result', { state: result });
        } catch (error) {
            console.error('🚨 게임 종료 처리 중 치명적 오류 발생:', error);
            console.log('🚀 에러 발생으로 인한 강제 결과 화면 이동');

            // 에러 발생 시에도 결과 화면으로 이동
            endGameRef.current = false; // 플래그 리셋
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

    // 컴포넌트 마운트 시 게임 데이터 미리 로딩
    useEffect(() => {
        if (user?.email && stageId && !gameData.stageIdx) {
            initializeGame();
        }
    }, [user?.email, stageId, gameData.stageIdx]);

    useEffect(() => {
        updateStageSize();
        window.addEventListener('resize', updateStageSize);
        return () => window.removeEventListener('resize', updateStageSize);
    }, [updateStageSize]);

    useEffect(() => {
        if (showPreparation || !gameStarted) return; // gameStarted 조건 추가

        // ===== 게임 로직 개선: 실제 오염물질 데이터 기반 생성 =====
        // 오염물질 데이터가 로딩될 때까지 대기
        if (!gameData.pollutions || gameData.pollutions.length === 0) {
            console.log('⏳ 오염물질 데이터 로딩 중...');
            return;
        }

        console.log('🎮 오염물질 큐 생성 시작:', gameData.pollutions);

        // 스테이지별 오염물질 개수 계산 (4배 더 많이!)
        const currentStage = parseInt(stageId || '1');
        const mapNumber = parseInt(mapId || '1');

        // 기본 개수: 스테이지 번호 × 4
        let totalPollutants = currentStage * 4;

        // 맵별 추가 보너스 (더 많이!)
        if (mapNumber === 2) {
            totalPollutants += 8; // 맵 2는 +8개
        } else if (mapNumber === 3) {
            totalPollutants += 16; // 맵 3는 +16개
        }

        // 최소 1개, 최대 20개로 제한
        totalPollutants = Math.max(1, Math.min(totalPollutants, 20));

        console.log('🎯 오염물질 개수 결정:', {
            stageId,
            mapId,
            currentStage,
            mapNumber,
            finalCount: totalPollutants,
        });

        const { width, height } = stageSize;
        const queue: PollutantBody[] = [];

        for (let i = 0; i < totalPollutants; i++) {
            // 실제 오염물질 데이터에서 랜덤 선택
            const selectedPollution = gameData.pollutions[Math.floor(Math.random() * gameData.pollutions.length)];

            const radius = Math.random() * 20 + 30;

            // 🎯 사방향 스폰 시스템 활성화
            const spawnSide = Math.floor(Math.random() * 4); // 0: 위, 1: 오른쪽, 2: 아래, 3: 왼쪽
            let startX, startY, initialVelocity;

            switch (spawnSide) {
                case 0: // 위쪽에서 아래로 - 강하게 던지기
                    startX = width * 0.2 + Math.random() * (width * 0.6);
                    startY = -radius; // 화면 위쪽 밖에서 시작
                    initialVelocity = {
                        x: (Math.random() - 0.5) * 3, // 좌우 랜덤 움직임
                        y: 4 + Math.random() * 3, // 아래로 더 강하게 던지기 (화면 깊숙이 진입)
                    };
                    break;
                case 1: // 오른쪽에서 왼쪽으로 - 위쪽으로 포물선
                    startX = width + radius; // 화면 오른쪽 밖에서 시작
                    startY = height * 0.3 + Math.random() * (height * 0.4);
                    initialVelocity = {
                        x: -(3 + Math.random() * 3), // 왼쪽으로 더 강하게 (화면 깊숙이 진입)
                        y: -(2 + Math.random() * 2), // 위쪽으로 더 강하게 던지기
                    };
                    break;
                case 2: // 아래쪽에서 위로 - 강하게 던져 올리기
                    startX = width * 0.2 + Math.random() * (width * 0.6);
                    startY = height + radius; // 화면 아래쪽 밖에서 시작
                    initialVelocity = {
                        x: (Math.random() - 0.5) * 3, // 좌우 랜덤 움직임
                        y: -(5 + Math.random() * 3), // 위로 더 강하게 던지기 (화면 깊숙이 진입)
                    };
                    break;
                case 3: // 왼쪽에서 오른쪽으로 - 위쪽으로 포물선
                    startX = -radius; // 화면 왼쪽 밖에서 시작
                    startY = height * 0.3 + Math.random() * (height * 0.4);
                    initialVelocity = {
                        x: 3 + Math.random() * 3, // 오른쪽으로 더 강하게 (화면 깊숙이 진입)
                        y: -(2 + Math.random() * 2), // 위쪽으로 더 강하게 던지기
                    };
                    break;
                default:
                    // 기본값 (위쪽)
                    startX = width * 0.2 + Math.random() * (width * 0.6);
                    startY = -radius;
                    initialVelocity = {
                        x: (Math.random() - 0.5) * 3,
                        y: 2 + Math.random() * 2,
                    };
            }

            // 오염물질 타입별 색상 적용
            const color = getPollutionColor(selectedPollution.type);

            console.log(`🎯 오염물질 ${i} 생성:`, {
                name: selectedPollution.polName,
                type: selectedPollution.type,
                image: selectedPollution.polImg1,
                color,
                spawnSide: ['위쪽', '오른쪽', '아래쪽', '왼쪽'][spawnSide],
                position: { x: startX, y: startY },
                velocity: initialVelocity,
            });

            // 스폰 방향별 초기 회전 속도 설정
            let initialAngularVelocity;
            switch (spawnSide) {
                case 0: // 위쪽 - 빠른 회전
                    initialAngularVelocity = (Math.random() - 0.5) * 0.4;
                    break;
                case 1: // 오른쪽 - 시계방향 회전 선호
                    initialAngularVelocity = 0.1 + Math.random() * 0.3;
                    break;
                case 2: // 아래쪽 - 매우 빠른 회전
                    initialAngularVelocity = (Math.random() - 0.5) * 0.6;
                    break;
                case 3: // 왼쪽 - 반시계방향 회전 선호
                    initialAngularVelocity = -(0.1 + Math.random() * 0.3);
                    break;
                default:
                    initialAngularVelocity = (Math.random() - 0.5) * 0.3;
            }

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
                // 초기 속도 정보 추가
                initialVelocity,
                spawnSide,
                // 초기 회전 속도 추가
                initialAngularVelocity,
            });
        }

        setPollutantQueue(queue);
        setCurrentIndex(0);
        console.log('✅ 오염물질 큐 생성 완료:', queue.length);
        console.log('🎮 게임 상태:', { gameStarted, showPreparation, gameEnded });
    }, [stageSize, showPreparation, gameStarted, gameData.pollutions]); // gameStarted 의존성 추가

    // 🎯 새로운 다중 오염물질 시스템
    useEffect(() => {
        if (showPreparation || gameEnded || !gameStarted) return;
        if (!pollutantQueue.length) return;

        // 게임 종료 확인
        if (currentIndex >= pollutantQueue.length && activePollutants.length === 0) {
            endGame();
            return;
        }

        // 엔진 생성 (한 번만)
        if (!engineRef.current) {
            const engine = Matter.Engine.create({ gravity: { x: 0, y: 0.4 } });
            engineRef.current = engine;
        }

        const world = engineRef.current.world;

        // 🚀 동시 스폰 시스템: 2-3개씩 생성
        const spawnNewPollutants = () => {
            if (currentIndex >= pollutantQueue.length) return;

            // 현재 활성 오염물질이 2개 미만이고, 큐에 남은 오염물질이 있으면 새로 생성
            const maxActive = 3; // 최대 동시 3개
            const spawnCount = Math.min(
                maxActive - activePollutants.length, // 빈 자리만큼
                pollutantQueue.length - currentIndex, // 남은 오염물질 수
                Math.random() > 0.3 ? 2 : 3, // 70% 확률로 2개, 30% 확률로 3개
            );

            if (spawnCount <= 0) return;

            const newPollutants: PollutantBody[] = [];
            const newBodies: Matter.Body[] = [];

            for (let i = 0; i < spawnCount; i++) {
                const p = pollutantQueue[currentIndex + i];
                if (!p) break;

                const body = Matter.Bodies.circle(p.x, p.y, p.radius, {
                    restitution: 0.6,
                    friction: 0.1,
                    density: 0.001,
                    velocity: p.initialVelocity || {
                        x: Math.random() * 4 - 2,
                        y: 1 + Math.random() * 2,
                    },
                });

                const angularVel = p.initialAngularVelocity || (Math.random() - 0.5) * 0.3;
                Matter.Body.setAngularVelocity(body, angularVel);
                Matter.World.add(world, body);

                // 바디에 ID 저장 (추적용)
                (body as any).pollutantId = p.id;
                (body as any).hasReachedGameArea = false;
                (body as any).isDefeated = false;

                newPollutants.push({ ...p });
                newBodies.push(body);
            }

            setActivePollutants((prev) => [...prev, ...newPollutants]);
            setActiveBodies((prev) => [...prev, ...newBodies]);
            setCurrentIndex((prev) => prev + spawnCount);

            console.log(
                `🎯 ${spawnCount}개 오염물질 동시 생성: ${currentIndex + 1}-${currentIndex + spawnCount}/${
                    pollutantQueue.length
                }`,
            );
        };

        // 초기 스폰
        if (activePollutants.length === 0) {
            spawnNewPollutants();
        }

        // 애니메이션 루프
        const animate = () => {
            if (!engineRef.current || gameEnded) return;

            Matter.Engine.update(engineRef.current, 1000 / 60);

            // 모든 활성 오염물질 업데이트
            setActivePollutants((prevPollutants) => {
                const updatedPollutants: PollutantBody[] = [];
                const bodiesToRemove: Matter.Body[] = [];

                prevPollutants.forEach((pollutant, index) => {
                    const body = activeBodies[index];
                    if (!body) return;

                    // 게임 영역 도달 확인 (조건 대폭 완화)
                    const gameAreaMargin = Math.min(stageSize.width, stageSize.height) * 0.5;
                    const gameAreaReached =
                        body.position.x >= -gameAreaMargin &&
                        body.position.x <= stageSize.width + gameAreaMargin &&
                        body.position.y >= -gameAreaMargin &&
                        body.position.y <= stageSize.height + gameAreaMargin;

                    if (gameAreaReached && !(body as any).hasReachedGameArea) {
                        (body as any).hasReachedGameArea = true;
                    }

                    // 화면 밖으로 나갔는지 확인
                    const margin = pollutant.radius * 3;
                    const isOffScreen =
                        body.position.y > stageSize.height + margin ||
                        body.position.y < -margin ||
                        body.position.x < -margin ||
                        body.position.x > stageSize.width + margin;

                    if (isOffScreen) {
                        // 생명력 처리
                        if (!(body as any).isDefeated && (body as any).hasReachedGameArea) {
                            setLives((prev) => {
                                const newLives = Math.max(prev - 1, 0);
                                if (newLives === 0) {
                                    setTimeout(() => endGame(), 100);
                                }
                                return newLives;
                            });
                            console.log('💔 생명력 감소 (처치되지 않은 오염물질)');
                        } else if (!(body as any).hasReachedGameArea) {
                            console.log('🚫 게임 영역 미도달로 생명력 유지');
                        } else {
                            console.log('✅ 처치된 오염물질이 날아감 (생명력 유지)');
                        }

                        bodiesToRemove.push(body);
                        return; // 이 오염물질은 제거
                    }

                    // 처치된 오염물질의 투명도 감소
                    let newOpacity = pollutant.opacity;
                    if ((body as any).isDefeated) {
                        const screenCenter = { x: stageSize.width / 2, y: stageSize.height / 2 };
                        const distance = Math.sqrt(
                            Math.pow(body.position.x - screenCenter.x, 2) +
                                Math.pow(body.position.y - screenCenter.y, 2),
                        );
                        const maxDistance = Math.sqrt(
                            Math.pow(stageSize.width / 2, 2) + Math.pow(stageSize.height / 2, 2),
                        );
                        newOpacity = Math.max(0.1, 1 - (distance / maxDistance) * 0.8);
                    }

                    updatedPollutants.push({
                        ...pollutant,
                        x: body.position.x,
                        y: body.position.y,
                        angle: body.angle,
                        opacity: newOpacity,
                    });
                });

                // 제거할 바디들 정리
                bodiesToRemove.forEach((body) => {
                    Matter.World.remove(engineRef.current!.world, body);
                });

                // activeBodies 업데이트
                setActiveBodies((prevBodies) => prevBodies.filter((body) => !bodiesToRemove.includes(body)));

                return updatedPollutants;
            });

            // 새로운 오염물질 스폰 (기존 것들이 줄어들면)
            if (activePollutants.length < 2 && currentIndex < pollutantQueue.length) {
                setTimeout(spawnNewPollutants, 500); // 0.5초 후 새로 스폰
            }

            if (!gameEnded) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [pollutantQueue, currentIndex, stageSize, showPreparation, gameEnded, gameStarted, activePollutants.length]);

    useEffect(() => {
        // 게임 종료 조건: 생명력 0 또는 시간 0
        if ((lives === 0 || time === 0) && !gameEnded && gameStarted) {
            console.log('🏁 게임 종료: 생명력 또는 시간 소진', { lives, time });
            endGame();
        }
        // 모든 오염물질 처치 시 성공 (currentIndex가 큐 길이에 도달하고 활성 오염물질이 없을 때)
        else if (
            currentIndex >= pollutantQueue.length &&
            pollutantQueue.length > 0 &&
            activePollutants.length === 0 &&
            !gameEnded &&
            gameStarted
        ) {
            console.log('🏁 게임 종료: 모든 오염물질 처치 완료', {
                currentIndex,
                pollutantQueueLength: pollutantQueue.length,
                activePollutantsCount: activePollutants.length,
            });
            endGame();
        }
    }, [lives, time, currentIndex, pollutantQueue.length, activePollutants.length, gameEnded, endGame, gameStarted]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!showPreparation && !gameEnded && gameStarted) {
            // gameStarted 조건 추가
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
    }, [showPreparation, gameEnded, gameStarted]); // gameStarted 의존성 추가

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
        <Container $screenShake={screenShake}>
            <GameBackground backgroundImage={getStageBackground(stageId || '1')} />
            <GameUI>
                <TopGameUI>
                    <LeftSection>
                        <Lives>
                            {Array.from({ length: lives }).map((_, index) => (
                                <span key={index}>❤️</span>
                            ))}
                        </Lives>
                    </LeftSection>

                    <CenterSection>
                        <Timer>
                            <span>⏰</span>
                            {time}초
                        </Timer>
                    </CenterSection>

                    <RightSection>
                        <Score>
                            <span>🏆</span>
                            {score.toLocaleString()}
                        </Score>
                    </RightSection>
                </TopGameUI>

                {/* 중앙 알림 영역 */}
                <CenterNotificationArea>
                    {killNotification.show && (
                        <KillNotification>
                            ✨ {killNotification.pollutionName} 처치!
                            <ScoreText>+{killNotification.score}점</ScoreText>
                        </KillNotification>
                    )}
                </CenterNotificationArea>
            </GameUI>
            {showPreparation && (
                <GamePreparationModal
                    isOpen={showPreparation}
                    onClose={() => setShowPreparation(false)}
                    onStart={() => {
                        startTime.current = Date.now();
                        // 게임 시작 (데이터는 이미 로딩됨)
                        setShowPreparation(false);
                        setGameStarted(true); // 실제 게임 시작
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
                    if (gameEnded || showPreparation || !gameStarted) return; // gameStarted 조건 추가
                    e.evt.preventDefault();
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const point = stage.getPointerPosition();
                    if (!point) return;
                    setIsSlicing(true);
                    setSlicePoints([point.x, point.y]);
                    setSliceCount(0); // 새로운 스트로크 시작
                }}
                onMouseMove={(e) => {
                    if (gameEnded || showPreparation || !gameStarted || !isSlicing) return;
                    e.evt.preventDefault();
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const point = stage.getPointerPosition();
                    if (!point) return;

                    // 스와이프 길이 제한 (최대 17개 포인트로 1/3 축소)
                    if (slicePoints.length >= 34) {
                        // x,y 쌍이므로 17개 포인트 = 34개 값
                        setIsSlicing(false);
                        return;
                    }

                    setSlicePoints((prev) => [...prev, point.x, point.y]);

                    // 다중 오염물질과 충돌 검사
                    if (activePollutants.length > 0) {
                        handlePollutantSlice(); // 내부에서 충돌 검사 수행
                    }
                }}
                onMouseUp={(e) => {
                    if (gameEnded || showPreparation || !gameStarted) return; // gameStarted 조건 추가
                    e.evt.preventDefault();
                    if (!isSlicing) return;
                    setIsSlicing(false);
                    setSliceCount(0); // 스트로크 종료

                    // 슬라이스 길이 계산
                    let length = 0;
                    for (let i = 0; i < slicePoints.length - 2; i += 2) {
                        const dx = slicePoints[i + 2] - slicePoints[i];
                        const dy = slicePoints[i + 3] - slicePoints[i + 1];
                        length += Math.sqrt(dx * dx + dy * dy);
                    }

                    // 점수 추가 (슬라이스 길이에 비례) - 처치하지 않은 경우만
                    if (length > 50 && sliceCount === 0) {
                        setScore((prev) => prev + Math.floor(length / 20)); // 점수 감소
                    }

                    // 조금 시간이 지난 후 슬라이스 트레일 초기화
                    setTimeout(() => {
                        setSlicePoints([]);
                    }, 200);
                }}
                onTouchStart={(e) => {
                    if (gameEnded || showPreparation || !gameStarted) return; // gameStarted 조건 추가
                    e.evt.preventDefault();
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const point = stage.getPointerPosition();
                    if (!point) return;
                    setIsSlicing(true);
                    setSlicePoints([point.x, point.y]);
                    setSliceCount(0); // 새로운 스트로크 시작
                }}
                onTouchMove={(e) => {
                    if (gameEnded || showPreparation || !gameStarted || !isSlicing) return;
                    e.evt.preventDefault();
                    const stage = e.target.getStage();
                    if (!stage) return;
                    const point = stage.getPointerPosition();
                    if (!point) return;

                    // 스와이프 길이 제한 (최대 17개 포인트로 1/3 축소)
                    if (slicePoints.length >= 34) {
                        // x,y 쌍이므로 17개 포인트 = 34개 값
                        setIsSlicing(false);
                        return;
                    }

                    setSlicePoints((prev) => [...prev, point.x, point.y]);

                    // 다중 오염물질과 충돌 검사
                    if (activePollutants.length > 0) {
                        handlePollutantSlice(); // 내부에서 충돌 검사 수행
                    }
                }}
                onTouchEnd={(e) => {
                    if (gameEnded || showPreparation || !gameStarted) return; // gameStarted 조건 추가
                    e.evt.preventDefault();
                    if (!isSlicing) return;
                    setIsSlicing(false);
                    setSliceCount(0); // 스트로크 종료

                    // 슬라이스 길이 계산
                    let length = 0;
                    for (let i = 0; i < slicePoints.length - 2; i += 2) {
                        const dx = slicePoints[i + 2] - slicePoints[i];
                        const dy = slicePoints[i + 3] - slicePoints[i + 1];
                        length += Math.sqrt(dx * dx + dy * dy);
                    }

                    // 점수 추가 (슬라이스 길이에 비례) - 처치하지 않은 경우만
                    if (length > 50 && sliceCount === 0) {
                        setScore((prev) => prev + Math.floor(length / 20)); // 점수 감소
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

                    {/* 다중 오염물질 */}
                    {activePollutants.map((pollutant) => (
                        <Pollutant
                            key={pollutant.id}
                            id={pollutant.id}
                            x={pollutant.x}
                            y={pollutant.y}
                            angle={pollutant.angle}
                            radius={pollutant.radius}
                            color={pollutant.color}
                            opacity={pollutant.opacity}
                            onRemove={() => handlePollutantSlice(pollutant)}
                            // 게임 로직 개선: 오염물질 이미지 정보 전달
                            pollutionImage={(pollutant as any)?.pollutionImage}
                            pollutionName={(pollutant as any)?.pollutionData?.polName}
                        />
                    ))}

                    {/* 디버그 표시 제거 */}
                </Layer>
            </Stage>
            <TransitionWrapper $isVisible={true}>
                <div />
            </TransitionWrapper>
        </Container>
    );
};

export default InGameScreen;
