import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '@/components/common/Button';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useAuth } from '@/hooks/useAuth';
import { getUserItems } from '@/api/game';
import { getAllSliceSkins, getAllTapSkins, getUserSliceSkins, getUserTapSkins } from '@/api/skins';
import ShopItemModal from '@/components/modal/ShopItemModal';
import ShopSkinModal from '@/components/modal/ShopSkinModal';

const Container = styled.div`
    flex: 1;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding-top: 80px;
    padding-bottom: 60px;
`;

const Title = styled.h1`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
`;

const TabContainer = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    justify-content: center;
`;

const Tab = styled.button<{ $active: boolean }>`
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    border: none;
    background-color: ${({ $active, theme }) => ($active ? theme.colors.primary.main : theme.colors.background.light)};
    color: ${({ $active, theme }) => ($active ? theme.colors.text.white : theme.colors.text.primary)};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: ${({ $active, theme }) => ($active ? theme.colors.primary.dark : theme.colors.background.hover)};
    }
`;

const ItemGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
`;

const ItemCard = styled.div`
    background-color: ${({ theme }) => theme.colors.background.light};
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-4px);
    }
`;

const ItemImage = styled.img`
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
`;

const ItemName = styled.h3`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.1rem;
    margin: 0;
`;

const ItemPrice = styled.span`
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 0.9rem;
`;

const ShopScreen: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'skins' | 'items'>('items');
    const [items, setItems] = useState([]);
    const [skins, setSkins] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedSkin, setSelectedSkin] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user?.email) {
                    console.log('상점 데이터 로딩 시작');
                    const [itemsData, sliceSkinsData, tapSkinsData, userSliceSkins, userTapSkins] = await Promise.all([
                        getUserItems(user.email),
                        getAllSliceSkins(user.email),
                        getAllTapSkins(user.email),
                        getUserSliceSkins(user.email),
                        getUserTapSkins(user.email),
                    ]);

                    console.log('아이템 데이터:', itemsData);
                    console.log('슬라이스 스킨 데이터:', sliceSkinsData);
                    console.log('탭 스킨 데이터:', tapSkinsData);
                    console.log('보유한 슬라이스 스킨:', userSliceSkins);
                    console.log('보유한 탭 스킨:', userTapSkins);

                    // 아이템 데이터 구조 수정
                    const processedItems =
                        itemsData.items?.map((userItem) => ({
                            ...userItem.item,
                            userItemIdx: userItem.userItemIdx,
                            isUsed: userItem.isUsed,
                        })) || [];

                    console.log('가공된 아이템 데이터:', processedItems);

                    // 보유한 스킨 인덱스 목록 생성
                    const ownedSkinIndices = new Set([
                        ...(userSliceSkins || []).map((skin) => skin.skinIdx),
                        ...(userTapSkins || []).map((skin) => skin.skinIdx),
                    ]);

                    // 스킨 데이터 구조 수정
                    const processedSkins = [...(sliceSkinsData || []), ...(tapSkinsData || [])].filter(
                        (skin) => !ownedSkinIndices.has(skin.skinIdx),
                    );

                    console.log('가공된 스킨 데이터:', processedSkins);

                    setItems(processedItems);
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
                const [itemsData, sliceSkinsData, tapSkinsData, userSliceSkins, userTapSkins] = await Promise.all([
                    getUserItems(user.email),
                    getAllSliceSkins(user.email),
                    getAllTapSkins(user.email),
                    getUserSliceSkins(user.email),
                    getUserTapSkins(user.email),
                ]);

                console.log('갱신된 아이템 데이터:', itemsData);
                console.log('갱신된 슬라이스 스킨 데이터:', sliceSkinsData);
                console.log('갱신된 탭 스킨 데이터:', tapSkinsData);
                console.log('갱신된 보유한 슬라이스 스킨:', userSliceSkins);
                console.log('갱신된 보유한 탭 스킨:', userTapSkins);

                // 아이템 데이터 구조 수정
                const processedItems =
                    itemsData.items?.map((userItem) => ({
                        ...userItem.item,
                        userItemIdx: userItem.userItemIdx,
                        isUsed: userItem.isUsed,
                    })) || [];

                console.log('갱신된 가공 아이템 데이터:', processedItems);

                // 보유한 스킨 인덱스 목록 생성
                const ownedSkinIndices = new Set([
                    ...(userSliceSkins || []).map((skin) => skin.skinIdx),
                    ...(userTapSkins || []).map((skin) => skin.skinIdx),
                ]);

                // 스킨 데이터 구조 수정
                const processedSkins = [...(sliceSkinsData || []), ...(tapSkinsData || [])].filter(
                    (skin) => !ownedSkinIndices.has(skin.skinIdx),
                );

                console.log('갱신된 가공 스킨 데이터:', processedSkins);

                setItems(processedItems);
                setSkins(processedSkins);
            }
        } catch (error) {
            console.error('데이터 갱신 실패:', error);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <Container>
            <Title>상점</Title>

            <TabContainer>
                <Tab $active={activeTab === 'items'} onClick={() => setActiveTab('items')}>
                    아이템
                </Tab>
                <Tab $active={activeTab === 'skins'} onClick={() => setActiveTab('skins')}>
                    스킨
                </Tab>
            </TabContainer>

            <ItemGrid>
                {activeTab === 'skins'
                    ? skins.map((skin) => (
                          <ItemCard key={skin.skinIdx} onClick={() => setSelectedSkin(skin)}>
                              <ItemImage src={skin.skinImg} alt={skin.skinName} />
                              <ItemName>{skin.skinName}</ItemName>
                              <ItemPrice>
                                  {skin.priceType === 'P' ? '포인트' : '캐시'} {skin.skinPrice}
                              </ItemPrice>
                          </ItemCard>
                      ))
                    : items.map((item) => (
                          <ItemCard key={item.itemIdx} onClick={() => setSelectedItem(item)}>
                              <ItemImage src={item.itemImg} alt={item.itemName} />
                              <ItemName>{item.itemName}</ItemName>
                              <ItemPrice>
                                  {item.priceType === 'P' ? '포인트' : '캐시'} {item.itemPrice}
                              </ItemPrice>
                          </ItemCard>
                      ))}
            </ItemGrid>

            {selectedItem && <ShopItemModal item={selectedItem} onClose={() => setSelectedItem(null)} onPurchase={handlePurchase} />}
            {selectedSkin && <ShopSkinModal skin={selectedSkin} onClose={() => setSelectedSkin(null)} onPurchase={handlePurchase} />}
        </Container>
    );
};

export default ShopScreen;
