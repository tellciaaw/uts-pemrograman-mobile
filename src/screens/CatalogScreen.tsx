import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../types';
import { Header } from '../components/Header';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/mockData';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'CatalogTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

const CATEGORIES = ['Semua', 'Kemeja', 'Kaos & Polo', 'Jaket & Rompi'];

export const CatalogScreen: React.FC<Props> = ({ route, navigation }) => {
  const { favorites, toggleFavorite } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (route.params?.category) {
      setSelectedCategory(route.params.category);
    }
  }, [route.params?.category]);

  const filteredProducts = PRODUCTS.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'Semua' ||
      prod.category === selectedCategory ||
      (selectedCategory === 'Celana' && prod.category === 'Celana');

    const matchesSearch =
      searchQuery.trim() === '' ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.fabricSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.categorySub.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleChatTeam = () => {
    Alert.alert(
      'Konsultasi Mockup Gratis',
      'Tim desainer dan penjahit master Konveksiku siap membantu via WhatsApp (0812-3456-7890).',
      [
        {
          text: 'Hubungi WhatsApp',
          onPress: () =>
            Alert.alert('Membuka WhatsApp', 'Mengarahkan ke percakapan konsultasi...'),
        },
        { text: 'Tutup', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <Header
        title="Katalog"
        subtitle="KONVEKSIKU"
        onAvatarPress={() => navigation.navigate('ProfileTab')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari model pakaian atau kain..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setSelectedCategory('Semua')}
            activeOpacity={0.7}
          >
            <Ionicons name="options-outline" size={20} color={COLORS.accentBlue} />
          </TouchableOpacity>
        </View>

        {/* Category Pills Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catPill, isActive && styles.catPillActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.catPillText,
                    isActive && styles.catPillTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Sub Info Bar */}
        <View style={styles.infoBar}>
          <View style={styles.infoLeft}>
            <Ionicons name="shield-checkmark" size={14} color={COLORS.accentBlue} />
            <Text style={styles.infoText}>
              Bahan grade A, free sampel bordir custom
            </Text>
          </View>
          <Text style={styles.modelCountText}>
            {filteredProducts.length > 0 ? `${filteredProducts.length * 10} Model` : '0 Model'}
          </Text>
        </View>

        {/* Product Grid (2 columns) */}
        <View style={styles.productGrid}>
          {filteredProducts.map((prod) => {
            const isFav = favorites.includes(prod.id);
            return (
              <TouchableOpacity
                key={prod.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('ProductDetail', { productId: prod.id })
                }
                activeOpacity={0.85}
              >
                {/* Image & Badges */}
                <View style={styles.imageBox}>
                  <Image
                    source={prod.image}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.minPcsBadge}>
                    <Text style={styles.minPcsText}>Min. {prod.minPcs} pcs</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.favBtn}
                    onPress={() => toggleFavorite(prod.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={isFav ? 'heart' : 'heart-outline'}
                      size={18}
                      color={isFav ? COLORS.danger : COLORS.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                {/* Details */}
                <View style={styles.cardBody}>
                  <Text style={styles.catSubText} numberOfLines={1}>
                    {prod.categorySub}
                  </Text>
                  <Text style={styles.prodName} numberOfLines={1}>
                    {prod.name}
                  </Text>
                  <Text style={styles.fabricText} numberOfLines={1}>
                    {prod.fabricSummary}
                  </Text>

                  <View style={styles.priceRow}>
                    <View>
                      <Text style={styles.priceLabel}>Harga</Text>
                      <Text style={styles.priceValue}>
                        Rp {prod.basePrice.toLocaleString('id-ID')}
                      </Text>
                    </View>
                    <Text style={styles.perPcsText}>/pcs</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Design Callout Card */}
        <View style={styles.customCtaBox}>
          <View style={styles.customIconCircle}>
            <Ionicons name="cut-outline" size={20} color={COLORS.accentBlue} />
          </View>
          <View style={styles.customCtaTextWrapper}>
            <Text style={styles.customCtaTitle}>Punya Desain Sendiri?</Text>
            <Text style={styles.customCtaSub}>
              Konsultasikan pola & mockup gratis
            </Text>
          </View>
          <TouchableOpacity
            style={styles.chatTimBtn}
            onPress={handleChatTeam}
            activeOpacity={0.8}
          >
            <Text style={styles.chatTimBtnText}>Chat Tim</Text>
          </TouchableOpacity>
        </View>

        {/* Extra spacing for floating bottom navigation */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    ...SHADOWS.soft,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.soft,
  },
  categoriesScroll: {
    gap: 8,
    marginBottom: 14,
    paddingVertical: 2,
  },
  catPill: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catPillActive: {
    backgroundColor: COLORS.primaryNavy,
    borderColor: COLORS.primaryNavy,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  catPillTextActive: {
    color: COLORS.white,
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginBottom: 16,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  infoText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  modelCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accentBlue,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  card: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF6FB',
    ...SHADOWS.card,
  },
  imageBox: {
    height: 120,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  minPcsBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  minPcsText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    padding: 12,
  },
  catSubText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  prodName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginBottom: 3,
  },
  fabricText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.accentBlue,
  },
  perPcsText: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginBottom: 1,
  },
  customCtaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4F9',
    borderRadius: 22,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E0EEF7',
    marginBottom: 16,
  },
  customIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#D7EBF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customCtaTextWrapper: {
    flex: 1,
  },
  customCtaTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  customCtaSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  chatTimBtn: {
    backgroundColor: '#006D94',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chatTimBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
});

