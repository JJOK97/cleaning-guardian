import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getUserItems, equipItem, unequipItem, getEquippedItems } from '@/api/game';
import { getUserTapSkins, getUserSliceSkins, getEquippedTapSkin, UserSkinData, equipTapSkin, unequipTapSkin } from '@/api/skins';
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
    const [equippedSkin, setEquippedSkin] = useState<UserSkinData | null>(null);
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

            // 스킨 데이터가 배열이 아닌 경우 처리
            const processedTapSkins = Array.isArray(tapSkins) ? tapSkins : tapSkins?.uskinlist || [];
            const processedSliceSkins = Array.isArray(sliceSkins) ? sliceSkins : sliceSkins?.uskinlist || [];

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
            console.log('Fetching equipped skin for email:', user.email);

            const response = await getEquippedTapSkin(user.email);
            console.log('Equipped skin response:', response);

            setEquippedSkin(response);
        } catch (error) {
            console.error('Error fetching equipped skin:', error);
            setEquippedSkin(null);
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
                const response = await equipTapSkin(user.email, (selectedItem as UserSkinData).skinIdx);
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
                const response = await unequipTapSkin(user.email, (selectedItem as UserSkinData).skinIdx);
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
            const isAEquipped = equippedSkin?.skinIdx === skinA.skinIdx;
            const isBEquipped = equippedSkin?.skinIdx === skinB.skinIdx;
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
                              sortedItems.map((skin) => (
                                  <ItemCard
                                      key={(skin as UserSkinData).uskinIdx}
                                      $isEquipped={equippedSkin?.skinIdx === (skin as UserSkinData).skinIdx}
                                      onClick={() => {
                                          setSelectedItem(skin);
                                          setIsModalOpen(true);
                                      }}
                                  >
                                      <ItemIcon
                                          src={(skin as UserSkinData).skin.skinImg || '/src/assets/img/skins/default.png'}
                                          alt={(skin as UserSkinData).skin.skinName}
                                      />
                                      <ItemName>{(skin as UserSkinData).skin.skinName}</ItemName>
                                      <ItemCount>보유</ItemCount>
                                      {equippedSkin?.skinIdx === (skin as UserSkinData).skinIdx && <EquippedBadge>장착됨</EquippedBadge>}
                                  </ItemCard>
                              ))}
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
                    equippedSkin={equippedSkin}
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
