import React from 'react';
import { useNavigate } from 'react-router-dom';
import { commonStyles } from '../../styles/common';
import { StageData } from '../../types/game';
import './StageSelectScreen.css';

const stages: StageData[] = [
    { id: 1, name: '1단계', difficulty: '쉬움', pollutantCount: 10 },
    { id: 2, name: '2단계', difficulty: '보통', pollutantCount: 15 },
    { id: 3, name: '3단계', difficulty: '어려움', pollutantCount: 20 },
];

const StageSelectScreen: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className='stage-select-container'>
            <div className='stage-select-content'>
                {/* 헤더 영역 */}
                <div className='stage-select-header'>
                    <h1 style={commonStyles.title}>스테이지 선택</h1>
                    <button
                        onClick={() => navigate('/main')}
                        className='header-button'
                    >
                        메인으로
                    </button>
                </div>

                {/* 스테이지 그리드 영역 */}
                <div className='stage-select-grid'>
                    {stages.map((stage) => (
                        <div
                            key={stage.id}
                            onClick={() => navigate('/game', { state: { stageId: stage.id } })}
                            className='stage-card'
                        >
                            <span className='stage-name'>{stage.name}</span>
                            <span className='stage-difficulty'>{stage.difficulty}</span>
                            <span className='stage-pollutant-count'>오염물질 {stage.pollutantCount}개</span>
                        </div>
                    ))}
                </div>

                {/* 하단 영역 */}
                <div className='stage-select-footer'>
                    <button
                        onClick={() => navigate('/main')}
                        className='main-button'
                    >
                        메인으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StageSelectScreen;
