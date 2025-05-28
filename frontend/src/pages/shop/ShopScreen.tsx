import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Button from '@/components/common/Button';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';
import { getUserItems } from '@/api/game';
import { getAllItems } from '@/api/game';
import { getAllSliceSkins, getAllTapSkins, getUserSliceSkins, getUserTapSkins } from '@/api/skins';
import ShopItemModal from '@/components/modal/ShopItemModal';
import ShopSkinModal from '@/components/modal/ShopSkinModal';

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const shimmer = keyframes`
    0% {
        background-position: -200px 0;
    }
    100% {
        background-position: calc(200px + 100%) 0;
    }
`;

const Container = styled.div`
    min-height: 100vh;
    max-height: 100vh;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 30%, #dee2e6 60%, #ced4da 100%);
    padding: 1rem;
    padding-bottom: 5rem;
    animation: ${fadeIn} 0.6s ease-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 50%);
        pointer-events: none;
    }
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 1rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    backdrop-filter: blur(15px);
    border: 2px solid rgba(206, 212, 218, 0.3);
    box-shadow: 0 8px 32px rgba(108, 117, 125, 0.15);
    width: 100%;
    max-width: 800px;
    margin-top: 1rem;
    flex-shrink: 0;
`;

const Title = styled.h1`
    color: #495057;
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(73, 80, 87, 0.1);
`;

const Subtitle = styled.p`
    color: #6c757d;
    font-size: 0.75rem;
    margin: 0;
    line-height: 1.4;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 1200px;
    flex: 1;
    min-height: 0;
`;

const ShopSection = styled.div`
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    backdrop-filter: blur(15px);
    border: 2px solid rgba(206, 212, 218, 0.3);
    box-shadow: 0 8px 32px rgba(108, 117, 125, 0.15);
    position: relative;
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -200px;
        width: 200px;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(206, 212, 218, 0.1), transparent);
        animation: ${shimmer} 4s infinite;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #adb5bd, #ced4da, #adb5bd);
        border-radius: 20px 20px 0 0;
    }
`;

const TabContainer = styled.div`
    display: flex;
    background: rgba(206, 212, 218, 0.08);
    border-radius: 20px 20px 0 0;
    position: relative;
    z-index: 2;
    border-bottom: 2px solid rgba(206, 212, 218, 0.15);
`;

const Tab = styled.button<{ $active: boolean }>`
    flex: 1;
    padding: 1rem 2rem;
    border: none;
    background: ${({ $active }) => ($active ? 'linear-gradient(135deg, #868E96 0%, #ADB5BD 50%, #CED4DA 100%)' : 'transparent')};
    color: ${({ $active }) => ($active ? '#fff' : '#495057')};
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
    font-weight: 600;
    text-shadow: ${({ $active }) => ($active ? '0 1px 2px rgba(0, 0, 0, 0.2)' : 'none')};
    border-radius: ${({ $active }) => ($active ? '20px 20px 0 0' : '0')};
    position: relative;

    &:first-child {
        border-radius: ${({ $active }) => ($active ? '20px 0 0 0' : '20px 0 0 0')};
    }

    &:last-child {
        border-radius: ${({ $active }) => ($active ? '0 20px 0 0' : '0 20px 0 0')};
    }

    &:hover {
        background: ${({ $active }) =>
            $active ? 'linear-gradient(135deg, #868E96 0%, #ADB5BD 50%, #CED4DA 100%)' : 'rgba(206, 212, 218, 0.1)'};
        color: ${({ $active }) => ($active ? '#fff' : '#343A40')};
    }

    &::before {
        content: '${({ $active }) => ($active ? '🛍️' : '')}';
        margin-right: ${({ $active }) => ($active ? '0.5rem' : '0')};
    }
`;

const SectionContent = styled.div`
    padding: 1rem;
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    position: relative;
    z-index: 1;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(206, 212, 218, 0.1);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #adb5bd, #ced4da);
        border-radius: 4px;

        &:hover {
            background: linear-gradient(180deg, #868e96, #adb5bd);
        }
    }
`;

const SectionTitle = styled.h2`
    color: #495057;
    font-size: 1.2rem;
    margin: 0 0 1rem 0;
    text-align: center;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(73, 80, 87, 0.1);
`;

const ItemGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 0.8rem;
    }
`;

const ItemCard = styled.div`
    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
    border-radius: 16px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 3px solid #e9ecef;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgba(108, 117, 125, 0.15);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(206, 212, 218, 0.08) 0%, transparent 50%);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    &::after {
        content: '✨';
        position: absolute;
        top: 8px;
        right: 8px;
        font-size: 1.2rem;
        opacity: 0;
        transition: all 0.3s ease;
        transform: scale(0.5) rotate(-15deg);
    }

    &:hover {
        transform: translateY(-8px) scale(1.02);
        border-color: #adb5bd;
        box-shadow: 0 12px 40px rgba(108, 117, 125, 0.25);

        &::before {
            opacity: 1;
        }

        &::after {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
    }

    &:active {
        transform: translateY(-4px) scale(1.01);
    }
`;

const ItemImageContainer = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 12px;
    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #ced4da;
    overflow: hidden;
    position: relative;
    box-shadow: 0 4px 12px rgba(108, 117, 125, 0.2);

    &::after {
        content: '';
        position: absolute;
        top: -3px;
        left: -3px;
        right: -3px;
        bottom: -3px;
        background: linear-gradient(45deg, #ced4da, #adb5bd, #ced4da);
        border-radius: 15px;
        z-index: -1;
    }
`;

const ItemImage = styled.img`
    width: 60px;
    height: 60px;
    object-fit: contain;
    transition: transform 0.3s ease;
    filter: drop-shadow(0 2px 4px rgba(108, 117, 125, 0.2));

    ${ItemCard}:hover & {
        transform: scale(1.15) rotate(5deg);
    }
`;

const ItemName = styled.h3`
    color: #495057;
    font-size: 0.85rem;
    margin: 0;
    text-align: center;
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(73, 80, 87, 0.1);
    line-height: 1.3;
    max-height: 2.6rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

const ItemPrice = styled.div<{ $priceType: 'P' | 'C' }>`
    display: flex;
    align-items: center;
    gap: 0.3rem;
    background: ${
        ({ $priceType }) =>
            $priceType === 'C'
                ? 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)' // 밝은 파랑
                : 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)' // 밝은 노랑
    };
    padding: 0.4rem 0.8rem;
    border-radius: 12px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    box-shadow: ${({ $priceType }) => ($priceType === 'C' ? '0 3px 8px rgba(96, 165, 250, 0.4)' : '0 3px 8px rgba(252, 211, 77, 0.4)')};
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
        border-radius: 10px;
    }
`;

const PriceIcon = styled.img`
    width: 14px;
    height: 14px;
    object-fit: contain;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
`;

const PriceText = styled.span`
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const EmptyState = styled.div`
    text-align: center;
    color: #495057;
    padding: 2rem 1rem;
    background: linear-gradient(135deg, rgba(206, 212, 218, 0.08) 0%, rgba(233, 236, 239, 0.15) 100%);
    border-radius: 16px;
    border: 2px solid rgba(206, 212, 218, 0.2);
    backdrop-filter: blur(10px);

    .empty-icon {
        font-size: 2.5rem;
        margin-bottom: 0.8rem;
        opacity: 0.7;
    }

    .empty-text {
        font-size: 1rem;
        margin-bottom: 0.3rem;
        font-weight: 600;
        color: #495057;
    }

    .empty-subtext {
        font-size: 0.9rem;
        opacity: 0.8;
        line-height: 1.4;
        color: #6c757d;
    }
`;

const ShopScreen: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'skins' | 'items'>('items');
    const [items, setItems] = useState<any[]>([]);
    const [skins, setSkins] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [selectedSkin, setSelectedSkin] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user?.email) {
                    const [allItemsData, sliceSkinsData, tapSkinsData, userSliceSkins, userTapSkins] = await Promise.all([
                        getAllItems(), // 전체 아이템 목록
                        getAllSliceSkins(user.email),
                        getAllTapSkins(user.email),
                        getUserSliceSkins(user.email),
                        getUserTapSkins(user.email),
                    ]);

                    // 전체 아이템에서 사용자가 보유하지 않은 아이템만 필터링
                    const availableItems = (allItemsData as any)?.items || [];

                    console.log('갱신된 구매 가능 아이템 데이터:', availableItems);

                    // 보유한 스킨 인덱스 목록 생성
                    const ownedSkinIndices = new Set([
                        ...(userSliceSkins || []).map((skin: any) => skin.skinIdx),
                        ...(userTapSkins || []).map((skin: any) => skin.skinIdx),
                    ]);

                    // 스킨 데이터 구조 수정 - API 응답 구조에 맞게 수정
                    const allSkins = [
                        ...((sliceSkinsData as any)?.skins || sliceSkinsData || []),
                        ...((tapSkinsData as any)?.skins || tapSkinsData || []),
                    ];

                    const processedSkins = allSkins
                        .filter((skin: any) => skin && skin.skinIdx) // null 값 제거
                        .filter((skin: any) => !ownedSkinIndices.has(skin.skinIdx));

                    console.log('갱신된 가공 스킨 데이터:', processedSkins);

                    setItems(availableItems);
                    setSkins(processedSkins);
                }
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handlePurchase = async () => {
        try {
            if (user?.email) {
                console.log('구매 후 데이터 갱신 시작');
                const [allItemsData, userItemsData, sliceSkinsData, tapSkinsData, userSliceSkins, userTapSkins] = await Promise.all([
                    getAllItems(), // 전체 아이템 목록
                    getUserItems(user.email), // 사용자 보유 아이템
                    getAllSliceSkins(user.email),
                    getAllTapSkins(user.email),
                    getUserSliceSkins(user.email),
                    getUserTapSkins(user.email),
                ]);

                // 전체 아이템에서 사용자가 보유하지 않은 아이템만 필터링
                const availableItems = allItemsData as any;

                // 보유한 스킨 인덱스 목록 생성
                const ownedSkinIndices = new Set([
                    ...(userSliceSkins || []).map((skin: any) => skin.skinIdx),
                    ...(userTapSkins || []).map((skin: any) => skin.skinIdx),
                ]);

                // 스킨 데이터 구조 수정 - API 응답 구조에 맞게 수정
                const allSkins = [
                    ...((sliceSkinsData as any)?.skins || sliceSkinsData || []),
                    ...((tapSkinsData as any)?.skins || tapSkinsData || []),
                ];

                const processedSkins = allSkins
                    .filter((skin: any) => skin && skin.skinIdx) // null 값 제거
                    .filter((skin: any) => !ownedSkinIndices.has(skin.skinIdx));

                console.log('갱신된 가공 스킨 데이터:', processedSkins);

                setItems(availableItems);
                setSkins(processedSkins);
            }
        } catch (error) {
            console.error('데이터 갱신 실패:', error);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    const currentItems = activeTab === 'skins' ? skins : items;

    return (
        <Container>
            <Header>
                <Title>상점</Title>
                <Subtitle>아이템과 스킨으로 게임을 더욱 재미있게 즐겨보세요!</Subtitle>
            </Header>

            <ContentWrapper>
                <ShopSection>
                    <TabContainer>
                        <Tab $active={activeTab === 'items'} onClick={() => setActiveTab('items')}>
                            아이템
                        </Tab>
                        <Tab $active={activeTab === 'skins'} onClick={() => setActiveTab('skins')}>
                            스킨
                        </Tab>
                    </TabContainer>

                    <SectionContent>
                        {currentItems.length > 0 ? (
                            <ItemGrid>
                                {activeTab === 'skins'
                                    ? skins.map((skin: any) => (
                                          <ItemCard key={skin.skinIdx} onClick={() => setSelectedSkin(skin)}>
                                              <ItemImageContainer>
                                                  <ItemImage
                                                      src={`/assets/img/skins/${skin.skinImg}`}
                                                      alt={skin.skinName}
                                                      onError={(e) => {
                                                          e.currentTarget.src = '/assets/img/skins/default.png';
                                                      }}
                                                  />
                                              </ItemImageContainer>
                                              <ItemName>{skin.skinName}</ItemName>
                                              <ItemPrice $priceType={skin.priceType}>
                                                  <PriceIcon
                                                      src={
                                                          skin.priceType === 'P'
                                                              ? '/assets/img/header/point.png'
                                                              : '/assets/img/header/cash.png'
                                                      }
                                                      alt={skin.priceType === 'P' ? '포인트' : '캐시'}
                                                  />
                                                  <PriceText>{skin.skinPrice}</PriceText>
                                              </ItemPrice>
                                          </ItemCard>
                                      ))
                                    : items.map((item: any) => (
                                          <ItemCard key={item.itemIdx} onClick={() => setSelectedItem(item)}>
                                              <ItemImageContainer>
                                                  <ItemImage
                                                      src={`/assets/img/items/${item.itemImg}.png`}
                                                      alt={item.itemName}
                                                      onError={(e) => {
                                                          e.currentTarget.src = '/assets/img/items/default.png';
                                                      }}
                                                  />
                                              </ItemImageContainer>
                                              <ItemName>{item.itemName}</ItemName>
                                              <ItemPrice $priceType={item.priceType}>
                                                  <PriceIcon
                                                      src={
                                                          item.priceType === 'P'
                                                              ? '/assets/img/header/point.png'
                                                              : '/assets/img/header/cash.png'
                                                      }
                                                      alt={item.priceType === 'P' ? '포인트' : '캐시'}
                                                  />
                                                  <PriceText>{item.itemPrice}</PriceText>
                                              </ItemPrice>
                                          </ItemCard>
                                      ))}
                            </ItemGrid>
                        ) : (
                            <EmptyState>
                                <div className='empty-icon'>{activeTab === 'items' ? '🎮' : '🎨'}</div>
                                <div className='empty-text'>
                                    {activeTab === 'items' ? '구매 가능한 아이템이 없습니다' : '구매 가능한 스킨이 없습니다'}
                                </div>
                                <div className='empty-subtext'>
                                    {activeTab === 'items'
                                        ? '새로운 아이템이 곧 추가될 예정입니다!'
                                        : '새로운 스킨이 곧 추가될 예정입니다!'}
                                </div>
                            </EmptyState>
                        )}
                    </SectionContent>
                </ShopSection>
            </ContentWrapper>

            {selectedItem && <ShopItemModal item={selectedItem} onClose={() => setSelectedItem(null)} onPurchase={handlePurchase} />}
            {selectedSkin && <ShopSkinModal skin={selectedSkin} onClose={() => setSelectedSkin(null)} onPurchase={handlePurchase} />}
        </Container>
    );
};

export default ShopScreen;
