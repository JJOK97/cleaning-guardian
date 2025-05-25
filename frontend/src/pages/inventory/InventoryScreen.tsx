import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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
            console.log('Fetching items for email:', user.email);

            const response = await getUserItems(user.email);
            console.log('Items response:', response);

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
            console.log('Fetching skins for email:', user.email);

            const [tapSkins, sliceSkins] = await Promise.all([getUserTapSkins(user.email), getUserSliceSkins(user.email)]);

            console.log('Raw tap skins response:', tapSkins);
            console.log('Raw slice skins response:', sliceSkins);

            // 스킨 데이터 처리
            const processedTapSkins = tapSkins || [];
            const processedSliceSkins = sliceSkins || [];

            console.log('Processed tap skins:', processedTapSkins);
            console.log('Processed slice skins:', processedSliceSkins);

            const allSkins = [...processedTapSkins, ...processedSliceSkins];
            console.log('Combined skins:', allSkins);
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
            console.log('Fetching equipped items for email:', user.email);

            const response = await getEquippedItems(user.email);
            console.log('Equipped items response:', response);

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
            console.log('Fetching equipped skins for email:', user.email);

            const [equippedTapSkin, equippedSliceSkin] = await Promise.all([
                getEquippedTapSkin(user.email),
                getEquippedSliceSkin(user.email),
            ]);

            console.log('Equipped tap skin response:', equippedTapSkin);
            console.log('Equipped slice skin response:', equippedSliceSkin);

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
                console.log('Tab changed to skins, fetching data...');
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
            const isAEquipped = equippedSkins.tap?.skinIdx === skinA.skinIdx || equippedSkins.slice?.skinIdx === skinA.skinIdx;
            const isBEquipped = equippedSkins.tap?.skinIdx === skinB.skinIdx || equippedSkins.slice?.skinIdx === skinB.skinIdx;
            if (isAEquipped && !isBEquipped) return -1;
            if (!isAEquipped && isBEquipped) return 1;
        }
        return 0;
    });

    return (
        <PageContainer>
            <ContentWrapper>
                <Title>인벤토리</Title>

                <TabContainer>
                    <TabButton $active={activeTab === 'items'} onClick={() => setActiveTab('items')}>
                        아이템
                    </TabButton>
                    <TabButton $active={activeTab === 'skins'} onClick={() => setActiveTab('skins')}>
                        스킨
                    </TabButton>
                </TabContainer>

                {isLoading ? (
                    <LoadingScreen />
                ) : (
                    <InventoryGrid>
                        {activeTab === 'items'
                            ? // 아이템 목록 렌더링
                              sortedItems.map((item) => (
                                  <ItemCard
                                      key={(item as UserItem).userItemIdx}
                                      $isEquipped={equippedItems.some((eq) => eq.itemIdx === (item as UserItem).itemIdx)}
                                      onClick={() => {
                                          setSelectedItem(item);
                                          setIsModalOpen(true);
                                      }}
                                  >
                                      <ItemIcon src={(item as UserItem).item.itemImg} alt={(item as UserItem).item.itemName} />
                                      <ItemName>{(item as UserItem).item.itemName}</ItemName>
                                      <ItemCount>보유 수량: {(item as UserItem).count}</ItemCount>
                                      {equippedItems.some((eq) => eq.itemIdx === (item as UserItem).itemIdx) && (
                                          <EquippedBadge>장착됨</EquippedBadge>
                                      )}
                                  </ItemCard>
                              ))
                            : // 스킨 목록 렌더링
                              sortedItems.map((skin) => {
                                  const skinData = (skin as UserSkinData).skin;
                                  // skin 객체가 없는 경우 기본값 사용
                                  const displayName = skinData?.skinName || `스킨 ${(skin as UserSkinData).skinIdx}`;
                                  const displayImg = skinData?.skinImg || '/src/assets/img/skins/default.png';

                                  return (
                                      <ItemCard
                                          key={(skin as UserSkinData).uskinIdx}
                                          $isEquipped={
                                              equippedSkins.tap?.skinIdx === (skin as UserSkinData).skinIdx ||
                                              equippedSkins.slice?.skinIdx === (skin as UserSkinData).skinIdx
                                          }
                                          onClick={() => {
                                              setSelectedItem(skin);
                                              setIsModalOpen(true);
                                          }}
                                      >
                                          <ItemIcon src={displayImg} alt={displayName} />
                                          <ItemName>{displayName}</ItemName>
                                          <ItemCount>보유</ItemCount>
                                          {(() => {
                                              const skinData = skin as UserSkinData;
                                              const isTapEquipped = equippedSkins.tap?.skinIdx === skinData.skinIdx;
                                              const isSliceEquipped = equippedSkins.slice?.skinIdx === skinData.skinIdx;

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
                )}

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
    display: flex;
    flex-direction: column;
    background: ${({ theme }) => theme.colors.background.main};
`;

const ContentWrapper = styled.div`
    flex: 1;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding-top: 80px; // 헤더 높이만큼 여백
    padding-bottom: 60px; // 푸터 높이만큼 여백
`;

const Title = styled.h1`
    text-align: center;
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 2rem;
`;

const TabContainer = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    justify-content: center;
`;

const TabButton = styled.button<{ $active: boolean }>`
    padding: 0.8rem 2rem;
    border-radius: 8px;
    border: none;
    background: ${({ $active, theme }) => ($active ? theme.colors.primary.main : theme.colors.background.light)};
    color: ${({ $active, theme }) => ($active ? theme.colors.text.primary : theme.colors.text.primary)};
    cursor: pointer;
    transition: all 0.2s;
    font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};

    &:hover {
        transform: translateY(-2px);
    }
`;

const InventoryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
`;

const ItemCard = styled.div<{ $isEquipped: boolean }>`
    background: ${({ theme }) => theme.colors.background.card};
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid ${({ $isEquipped, theme }) => ($isEquipped ? theme.colors.primary.main : 'transparent')};
    position: relative;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
`;

const ItemIcon = styled.img`
    width: 64px;
    height: 64px;
    object-fit: contain;
`;

const ItemName = styled.h3`
    font-size: 1rem;
    text-align: center;
    color: ${({ theme }) => theme.colors.text.primary};
`;

const ItemCount = styled.div`
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text.secondary};
`;

const EquippedBadge = styled.div`
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: ${({ theme }) => theme.colors.primary.main};
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
`;
