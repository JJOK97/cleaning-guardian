import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
    color: white;
`;

export const MapInfoContainer = styled.div`
    width: 100%;
    max-width: 1200px;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
`;

export const MapImage = styled.img`
    width: 100%;
    max-width: 600px;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

export const MapTitle = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

export const MapDescription = styled.p`
    font-size: 1.1rem;
    text-align: center;
    margin: 0;
    opacity: 0.9;
    line-height: 1.6;
`;

export const StageGrid = styled.div`
    width: 100%;
    max-width: 1200px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
    margin-bottom: 2rem;
`;

export const StageContainer = styled.div<{ $unlocked: boolean }>`
    background: ${({ $unlocked }) =>
        $unlocked
            ? 'linear-gradient(135deg, rgba(40,60,40,0.85) 0%, rgba(80,120,80,0.7) 100%)'
            : 'linear-gradient(135deg, rgba(60,60,60,0.7) 0%, rgba(30,30,30,0.6) 100%)'};
    border-radius: 16px;
    padding: 1.5rem;
    cursor: ${({ $unlocked }) => ($unlocked ? 'pointer' : 'not-allowed')};
    position: relative;
    transition: transform 0.2s ease-in-out;
    border: 2px solid ${({ $unlocked }) => ($unlocked ? 'rgba(120,255,120,0.18)' : 'rgba(120,120,120,0.12)')};
    box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.18);

    &:hover {
        transform: ${({ $unlocked }) => ($unlocked ? 'translateY(-4px)' : 'none')};
    }
`;

export const StageContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const StageNumber = styled.div`
    font-size: 1.2rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
`;

export const StageInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const StageTitle = styled.h3`
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0;
    color: white;
`;

export const StageDescription = styled.p`
    font-size: 1rem;
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.4;
`;

export const StartButton = styled.button`
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    margin-top: 1rem;

    &:disabled {
        background: linear-gradient(135deg, #666 0%, #444 100%);
        cursor: not-allowed;
        opacity: 0.7;
    }

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    }
`;

export const BackButton = styled.button`
    background: transparent;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    margin-top: 1rem;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.5);
    }
`;

export const LockedOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
`;

export const LockIcon = styled.span`
    font-size: 2rem;
    color: rgba(255, 255, 255, 0.8);
`;
