import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { getUserItems, equipItem, unequipItem, getEquippedItems } from '@/api/game';
import {
    getUserTapSkins,
    getUserSliceSkins,
    getEquippedTapSkin,
    getEquippedSliceSkin,
    UserSkinData,
    equipTapSkin,
    unequipTapSkin,
    equipSliceSkin,
    unequipSliceSkin,
} from '@/api/skins';
import { UserItem } from '@/types/inventory';
import ItemDetailModal from './ItemDetailModal';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/common/LoadingScreen';

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

const InventoryScreen: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'items' | 'skins'>('items');
    const [items, setItems] = useState<UserItem[]>([]);
    const [equippedItems, setEquippedItems] = useState<UserItem[]>([]);
    const [skins, setSkins] = useState<UserSkinData[]>([]);
    const [equippedSkins, setEquippedSkins] = useState<{ tap: UserSkinData | null; slice: UserSkinData | null }>({
        tap: null,
        slice: null,
    });
    const [selectedItem, setSelectedItem] = useState<UserItem | UserSkinData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // 아이템 목록 조회
    const fetchItems = async () => {
        if (!user?.email) return;

        try {
            setIsLoading(true);

            const response = await getUserItems(user.email);

            if (response.success) {
                setItems(response.items || []);
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 스킨 목록 조회
    const fetchSkins = async () => {
        if (!user?.email) return;

        try {
            setIsLoading(true);

            const [tapSkins, sliceSkins] = await Promise.all([
                getUserTapSkins(user.email),
                getUserSliceSkins(user.email),
            ]);

            // 스킨 데이터 처리
            const processedTapSkins = tapSkins || [];
            const processedSliceSkins = sliceSkins || [];

            const allSkins = [...processedTapSkins, ...processedSliceSkins];
            setSkins(allSkins);
        } catch (error) {
            console.error('Error fetching skins:', error);
            setSkins([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 장착된 아이템 조회
    const fetchEquippedItems = async () => {
        if (!user?.email) return;

        try {
            const response = await getEquippedItems(user.email);

            if (response.success) {
                setEquippedItems(response.items || []);
            } else {
                setEquippedItems([]);
            }
        } catch (error) {
            console.error('Error fetching equipped items:', error);
            setEquippedItems([]);
        }
    };

    // 장착된 스킨 조회
    const fetchEquippedSkin = async () => {
        if (!user?.email) return;

        try {
            const [equippedTapSkin, equippedSliceSkin] = await Promise.all([
                getEquippedTapSkin(user.email),
                getEquippedSliceSkin(user.email),
            ]);

            setEquippedSkins({
                tap: equippedTapSkin,
                slice: equippedSliceSkin,
            });
        } catch (error) {
            console.error('Error fetching equipped skins:', error);
            setEquippedSkins({ tap: null, slice: null });
        }
    };

    useEffect(() => {
        if (user?.email) {
            if (activeTab === 'items') {
                fetchItems();
                fetchEquippedItems();
            } else {
                fetchSkins();
                fetchEquippedSkin();
            }
        }
    }, [user?.email, activeTab]);

    // 아이템 장착 처리
    const handleEquip = async (slot: number) => {
        if (!selectedItem || !user?.email) return;

        try {
            if (activeTab === 'items') {
                const response = await equipItem(user.email, (selectedItem as UserItem).itemIdx, slot);
                if (response.success) {
                    await Promise.all([fetchItems(), fetchEquippedItems()]);
                    setIsModalOpen(false);
                }
            } else {
                const skin = selectedItem as UserSkinData;

                // 스킨 타입 구분 (actionType 우선 사용)
                const skinType = skin.skin?.actionType;

                console.log('Equipping skin:', {
                    skinIdx: skin.skinIdx,
                    skinType,
                    actionType: skin.skin?.actionType,
                });

                let response;
                if (skinType === 'T') {
                    response = await equipTapSkin(user.email, skin.skinIdx);
                } else if (skinType === 'S') {
                    response = await equipSliceSkin(user.email, skin.skinIdx);
                } else {
                    // 타입을 알 수 없는 경우, 기본적으로 탭 스킨으로 시도
                    console.warn('Unknown skin type, trying tap skin first');
                    response = await equipTapSkin(user.email, skin.skinIdx);
                }

                if (response.includes('완료')) {
                    await Promise.all([fetchSkins(), fetchEquippedSkin()]);
                    setIsModalOpen(false);
                }
            }
        } catch (error) {
            console.error('Error equipping item:', error);
        }
    };

    // 아이템 해제 처리
    const handleUnequip = async () => {
        if (!selectedItem || !user?.email) return;

        try {
            if (activeTab === 'items') {
                const response = await unequipItem(user.email, (selectedItem as UserItem).itemIdx);
                if (response.success) {
                    await Promise.all([fetchItems(), fetchEquippedItems()]);
                    setIsModalOpen(false);
                }
            } else {
                const skin = selectedItem as UserSkinData;

                // 장착된 스킨 정보를 기반으로 탭/슬라이스 구분
                const isTapEquipped = equippedSkins.tap?.skinIdx === skin.skinIdx;
                const isSliceEquipped = equippedSkins.slice?.skinIdx === skin.skinIdx;

                console.log('Unequipping skin:', {
                    skinIdx: skin.skinIdx,
                    actionType: skin.skin?.actionType,
                    isTapEquipped,
                    isSliceEquipped,
                });

                let response;
                if (isTapEquipped) {
                    response = await unequipTapSkin(user.email, skin.skinIdx);
                } else if (isSliceEquipped) {
                    response = await unequipSliceSkin(user.email, skin.skinIdx);
                } else {
                    console.error('Skin is not equipped in either tap or slice');
                    return;
                }

                if (response.includes('완료')) {
                    await Promise.all([fetchSkins(), fetchEquippedSkin()]);
                    setIsModalOpen(false);
                }
            }
        } catch (error) {
            console.error('Error unequipping item:', error);
        }
    };

    // 정렬된 아이템/스킨 목록 (장착된 것이 앞으로)
    const sortedItems = [...(activeTab === 'items' ? items : skins)].sort((a, b) => {
        if (activeTab === 'items') {
            const itemA = a as UserItem;
            const itemB = b as UserItem;
            const isAEquipped = equippedItems.some((eq) => eq.itemIdx === itemA.itemIdx);
            const isBEquipped = equippedItems.some((eq) => eq.itemIdx === itemB.itemIdx);
            if (isAEquipped && !isBEquipped) return -1;
            if (!isAEquipped && isBEquipped) return 1;
        } else {
            const skinA = a as UserSkinData;
            const skinB = b as UserSkinData;
            const isAEquipped =
                equippedSkins.tap?.skinIdx === skinA.skinIdx || equippedSkins.slice?.skinIdx === skinA.skinIdx;
            const isBEquipped =
                equippedSkins.tap?.skinIdx === skinB.skinIdx || equippedSkins.slice?.skinIdx === skinB.skinIdx;
            if (isAEquipped && !isBEquipped) return -1;
            if (!isAEquipped && isBEquipped) return 1;
        }
        return 0;
    });

    return (
        <PageContainer>
            <Header>
                <Title>가방</Title>
                <Subtitle>보유한 아이템과 스킨을 관리하고 장착할 수 있습니다!</Subtitle>
            </Header>

            <ContentWrapper>
                <InventorySection>
                    <TabContainer>
                        <TabButton
                            $active={activeTab === 'items'}
                            onClick={() => setActiveTab('items')}
                        >
                            아이템
                        </TabButton>
                        <TabButton
                            $active={activeTab === 'skins'}
                            onClick={() => setActiveTab('skins')}
                        >
                            스킨
                        </TabButton>
                    </TabContainer>

                    <SectionContent>
                        {isLoading ? (
                            <LoadingScreen />
                        ) : (
                            <>
                                {(activeTab === 'items' ? items : skins).length > 0 ? (
                                    <InventoryGrid>
                                        {activeTab === 'items'
                                            ? // 아이템 목록 렌더링
                                              sortedItems.map((item) => (
                                                  <ItemCard
                                                      key={(item as UserItem).userItemIdx}
                                                      $isEquipped={equippedItems.some(
                                                          (eq) => eq.itemIdx === (item as UserItem).itemIdx,
                                                      )}
                                                      onClick={() => {
                                                          setSelectedItem(item);
                                                          setIsModalOpen(true);
                                                      }}
                                                  >
                                                      <ItemIcon
                                                          src={`/assets/img/items/${
                                                              (item as UserItem).item.itemImg
                                                          }.png`}
                                                          alt={(item as UserItem).item.itemName}
                                                      />
                                                      <ItemName>{(item as UserItem).item.itemName}</ItemName>
                                                      <ItemCount>보유 수량: {(item as UserItem).count}</ItemCount>
                                                      {equippedItems.some(
                                                          (eq) => eq.itemIdx === (item as UserItem).itemIdx,
                                                      ) && <EquippedBadge>장착됨</EquippedBadge>}
                                                  </ItemCard>
                                              ))
                                            : // 스킨 목록 렌더링
                                              sortedItems.map((skin) => {
                                                  const skinData = (skin as UserSkinData).skin;
                                                  // skin 객체가 없는 경우 기본값 사용
                                                  const displayName =
                                                      skinData?.skinName || `스킨 ${(skin as UserSkinData).skinIdx}`;
                                                  const displayImg =
                                                      skinData?.skinImg || '/src/assets/img/skins/default.png';

                                                  return (
                                                      <ItemCard
                                                          key={(skin as UserSkinData).uskinIdx}
                                                          $isEquipped={
                                                              equippedSkins.tap?.skinIdx ===
                                                                  (skin as UserSkinData).skinIdx ||
                                                              equippedSkins.slice?.skinIdx ===
                                                                  (skin as UserSkinData).skinIdx
                                                          }
                                                          onClick={() => {
                                                              setSelectedItem(skin);
                                                              setIsModalOpen(true);
                                                          }}
                                                      >
                                                          <ItemIcon
                                                              src={`/assets/img/skins/${displayImg}`}
                                                              alt={displayName}
                                                          />
                                                          <ItemName>{displayName}</ItemName>
                                                          <ItemCount>보유</ItemCount>
                                                          {(() => {
                                                              const skinData = skin as UserSkinData;
                                                              const isTapEquipped =
                                                                  equippedSkins.tap?.skinIdx === skinData.skinIdx;
                                                              const isSliceEquipped =
                                                                  equippedSkins.slice?.skinIdx === skinData.skinIdx;

                                                              if (isTapEquipped) {
                                                                  return <EquippedBadge>탭</EquippedBadge>;
                                                              } else if (isSliceEquipped) {
                                                                  return <EquippedBadge>슬라이스</EquippedBadge>;
                                                              }
                                                              return null;
                                                          })()}
                                                      </ItemCard>
                                                  );
                                              })}
                                    </InventoryGrid>
                                ) : (
                                    <EmptyState>
                                        <div className='empty-icon'>{activeTab === 'items' ? '🎮' : '🎨'}</div>
                                        <div className='empty-text'>
                                            {activeTab === 'items'
                                                ? '보유한 아이템이 없습니다'
                                                : '보유한 스킨이 없습니다'}
                                        </div>
                                        <div className='empty-subtext'>
                                            {activeTab === 'items'
                                                ? '상점에서 아이템을 구매해보세요!'
                                                : '상점에서 스킨을 구매해보세요!'}
                                        </div>
                                    </EmptyState>
                                )}
                            </>
                        )}
                    </SectionContent>
                </InventorySection>

                <ItemDetailModal
                    isOpen={isModalOpen}
                    item={selectedItem}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedItem(null);
                    }}
                    onEquip={handleEquip}
                    onUnequip={handleUnequip}
                    equippedItems={activeTab === 'items' ? equippedItems : []}
                    equippedSkins={equippedSkins}
                    activeTab={activeTab}
                />
            </ContentWrapper>
        </PageContainer>
    );
};

export default InventoryScreen;

const PageContainer = styled.div`
    min-height: 100vh;
    max-height: 100vh;
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 30%, #fde68a 60%, #fcd34d 100%);
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
        background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%);
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
    border: 2px solid rgba(252, 211, 77, 0.3);
    box-shadow: 0 8px 32px rgba(245, 158, 11, 0.2);
    width: 100%;
    max-width: 800px;
    margin-top: 1rem;
    flex-shrink: 0;
`;

const Title = styled.h1`
    color: #92400e;
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(146, 64, 14, 0.2);
`;

const Subtitle = styled.p`
    color: #a16207;
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

const InventorySection = styled.div`
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    backdrop-filter: blur(15px);
    border: 2px solid rgba(252, 211, 77, 0.3);
    box-shadow: 0 8px 32px rgba(245, 158, 11, 0.2);
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
        background: linear-gradient(90deg, transparent, rgba(252, 211, 77, 0.1), transparent);
        animation: ${shimmer} 4s infinite;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #fcd34d, #f59e0b, #fcd34d);
        border-radius: 20px 20px 0 0;
    }
`;

const TabContainer = styled.div`
    display: flex;
    background: rgba(252, 211, 77, 0.08);
    border-radius: 20px 20px 0 0;
    position: relative;
    z-index: 2;
    border-bottom: 2px solid rgba(252, 211, 77, 0.15);
`;

const TabButton = styled.button<{ $active: boolean }>`
    flex: 1;
    padding: 1rem 2rem;
    border: none;
    background: ${({ $active }) => ($active ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'transparent')};
    color: ${({ $active }) => ($active ? '#fff' : '#92400E')};
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
            $active ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'rgba(252, 211, 77, 0.1)'};
        color: ${({ $active }) => ($active ? '#fff' : '#B45309')};
    }

    &::before {
        content: '${({ $active }) => ($active ? '📦' : '')}';
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
        background: rgba(252, 211, 77, 0.1);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #fcd34d, #f59e0b);
        border-radius: 4px;

        &:hover {
            background: linear-gradient(180deg, #f59e0b, #d97706);
        }
    }
`;

const SectionTitle = styled.h2`
    color: #92400e;
    font-size: 1.2rem;
    margin: 0 0 1rem 0;
    text-align: center;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(146, 64, 14, 0.1);
`;

const InventoryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 0.8rem;
    }
`;

const EmptyState = styled.div`
    text-align: center;
    color: #92400e;
    padding: 2rem 1rem;
    background: linear-gradient(135deg, rgba(252, 211, 77, 0.08) 0%, rgba(254, 243, 199, 0.15) 100%);
    border-radius: 16px;
    border: 2px solid rgba(252, 211, 77, 0.2);
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
        color: #92400e;
    }

    .empty-subtext {
        font-size: 0.9rem;
        opacity: 0.8;
        line-height: 1.4;
        color: #a16207;
    }
`;

const ItemCard = styled.div<{ $isEquipped: boolean }>`
    background: linear-gradient(135deg, #fff 0%, #fffbeb 100%);
    border-radius: 16px;
    padding: 1.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 3px solid ${({ $isEquipped }) => ($isEquipped ? '#F59E0B' : '#FEF3C7')};
    backdrop-filter: blur(10px);
    box-shadow: ${({ $isEquipped }) =>
        $isEquipped ? '0 8px 32px rgba(245, 158, 11, 0.4)' : '0 4px 20px rgba(245, 158, 11, 0.15)'};
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(252, 211, 77, 0.1) 0%, transparent 50%);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    &::after {
        content: '${({ $isEquipped }) => ($isEquipped ? '⭐' : '✨')}';
        position: absolute;
        top: 8px;
        left: 8px;
        font-size: 1.2rem;
        opacity: ${({ $isEquipped }) => ($isEquipped ? '1' : '0')};
        transition: all 0.3s ease;
        transform: ${({ $isEquipped }) => ($isEquipped ? 'scale(1)' : 'scale(0.5)')};
    }

    &:hover {
        transform: translateY(-8px) scale(1.02);
        border-color: #f59e0b;
        box-shadow: 0 12px 40px rgba(245, 158, 11, 0.3);

        &::before {
            opacity: 1;
        }

        &::after {
            opacity: 1;
            transform: scale(1) rotate(15deg);
        }
    }

    &:active {
        transform: translateY(-4px) scale(1.01);
    }
`;

const ItemIcon = styled.img`
    width: 80px;
    height: 80px;
    object-fit: contain;
    transition: transform 0.3s ease;
    filter: drop-shadow(0 4px 8px rgba(245, 158, 11, 0.2));
    border-radius: 12px;
    background: linear-gradient(135deg, #fff 0%, #fef3c7 100%);
    padding: 0.5rem;
    border: 2px solid #fcd34d;

    ${ItemCard}:hover & {
        transform: scale(1.1) rotate(5deg);
    }
`;

const ItemName = styled.h3`
    font-size: 1rem;
    text-align: center;
    color: #92400e;
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(146, 64, 14, 0.1);
    line-height: 1.3;
    max-height: 2.6rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

const ItemCount = styled.div`
    font-size: 0.6rem;
    color: #a16207;
    background: rgba(252, 211, 77, 0.3);
    padding: 0.3rem 0.8rem;
    border-radius: 12px;
    border: 1px solid rgba(245, 158, 11, 0.3);
    font-weight: 600;
`;

const EquippedBadge = styled.div`
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    padding: 0.3rem 0.6rem;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
    border: 2px solid rgba(255, 255, 255, 0.3);
`;
