import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.background.overlay};
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const Modal = styled.div`
    background-color: ${({ theme }) => theme.colors.background.card};
    border-radius: 20px;
    padding: 2rem;
    width: 90%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    animation: fadeIn 0.3s ease-out;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const Title = styled.h2`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.8rem;
    text-align: center;
    margin: 0;
`;

const Description = styled.p`
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 1rem;
    text-align: center;
    margin: 0;
`;

const Countdown = styled.div`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 4rem;
    font-weight: bold;
    animation: pulse 1s ease-in-out infinite;

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
`;

interface PassiveItem {
    id: string;
    name: string;
    description: string;
    image: string;
    selected: boolean;
}

interface GamePreparationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: (selectedItems: string[]) => void;
    stageInfo: {
        name: string;
        description: string;
        difficulty: 'easy' | 'normal' | 'hard';
    };
}

const passiveItems: PassiveItem[] = [
    {
        id: 'double-score',
        name: '점수 2배',
        description: '획득하는 점수가 2배가 됩니다',
        image: '⭐',
        selected: false,
    },
    {
        id: 'slow-time',
        name: '시간 감속',
        description: '게임 시간이 1.5배 느려집니다',
        image: '⏰',
        selected: false,
    },
    {
        id: 'extra-life',
        name: '추가 생명',
        description: '생명이 1개 추가됩니다',
        image: '❤️',
        selected: false,
    },
];

const GamePreparationModal: React.FC<GamePreparationModalProps> = ({ isOpen, onClose, onStart, stageInfo }) => {
    const [items, setItems] = useState<PassiveItem[]>(passiveItems);
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (isOpen && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            const selectedItems = items.filter((item) => item.selected).map((item) => item.id);
            onStart(selectedItems);
        }
    }, [isOpen, countdown, onStart, items]);

    const toggleItem = (itemId: string) => {
        setItems(items.map((item) => (item.id === itemId ? { ...item, selected: !item.selected } : item)));
    };

    if (!isOpen) return null;

    return (
        <Overlay>
            <Modal>
                <Title>{stageInfo.name}</Title>
                <Description>{stageInfo.description}</Description>
                {countdown > 0 ? (
                    <Countdown>{countdown}</Countdown>
                ) : (
                    <Button
                        $variant='primary'
                        onClick={() => {
                            const selectedItems = items.filter((item) => item.selected).map((item) => item.id);
                            onStart(selectedItems);
                        }}
                    >
                        시작하기
                    </Button>
                )}
            </Modal>
        </Overlay>
    );
};

export default GamePreparationModal;
