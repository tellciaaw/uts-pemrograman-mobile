import React, { useState } from 'react';
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
  BottomTabScreenProps<MainTabParamList, 'HomeTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = () => {
    navigation.navigate('CatalogTab', { category: 'Semua' });
  };

  const handleCategoryPress = (catName: string) => {
    let target = 'Semua';
    if (catName === 'Kemeja') target = 'Kemeja';
    else if (catName === 'Celana') target = 'Celana';
    else if (catName === 'Sekolah') target = 'Kemeja';
    else if (catName === 'Custom') target = 'Kaos & Polo';
    navigation.navigate('CatalogTab', { category: target });
  };

  const popularProducts = PRODUCTS.slice(0, 2);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header */}
      <Header
        title="Beranda"
        subtitle="KONVEKSIKU"
        onAvatarPress={() => navigation.navigate('ProfileTab')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Greeting Row */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingText}>Halo, Selamat Datang! 👋</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>

          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() =>
              Alert.alert(
                'Notifikasi Produksi',
                'Pesanan #KNV-2025-0842 Anda sedang dalam proses penjahitan & bordir.'
              )
            }
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color={COLORS.primaryNavy} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari jenis pakaian, seragam, atau bahan..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => navigation.navigate('CatalogTab')}
            activeOpacity={0.7}
          >
            <Ionicons name="options-outline" size={20} color={COLORS.accentBlue} />
          </TouchableOpacity>
        </View>

        {/* Community Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.bannerLeft}>
            <View style={styles.discountBadge}>
              <Ionicons name="pricetag-outline" size={12} color="#0284C7" />
              <Text style={styles.discountBadgeText}>Diskon 15%</Text>
            </View>

            <Text style={styles.bannerTitle}>Promo Pesanan Komunitas</Text>
            <Text style={styles.bannerSubtitle}>
              Minimal order 24 pcs gratis bordir logo komputer berkualitas tinggi
            </Text>

            <TouchableOpacity
              style={styles.orderNowBtn}
              onPress={() =>
                navigation.navigate('ProductDetail', { productId: 'prod-1' })
              }
              activeOpacity={0.8}
            >
              <Text style={styles.orderNowBtnText}>Pesan Sekarang</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Hanger Watermark */}
          <View style={styles.hangerWrapper}>
            <Ionicons name="shirt-outline" size={80} color="#BAE6FD" style={{ opacity: 0.6 }} />
          </View>
        </View>

        {/* Category Selection Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kategori Pilihan</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CatalogTab')}
            style={styles.seeAllBtn}
          >
            <Text style={styles.seeAllText}>Lihat Semua</Text>
            <Ionicons name="chevron-forward" size={14} color={COLORS.accentBlue} />
          </TouchableOpacity>
        </View>

        <View style={styles.categoryGrid}>
          {[
            {
              id: 'cat-1',
              name: 'Kemeja',
              sub: 'PDL, Kantor',
              icon: 'shirt-outline',
            },
            {
              id: 'cat-2',
              name: 'Celana',
              sub: 'Chino, Cargo',
              icon: 'git-commit-outline',
            },
            {
              id: 'cat-3',
              name: 'Sekolah',
              sub: 'SD, SMP, SMA',
              icon: 'school-outline',
            },
            {
              id: 'cat-4',
              name: 'Custom',
              sub: 'Jaket & Kaos',
              icon: 'cut-outline',
            },
          ].map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(cat.name)}
              activeOpacity={0.7}
            >
              <View style={styles.categoryIconCircle}>
                <Ionicons
                  name={cat.icon as any}
                  size={20}
                  color={COLORS.accentBlue}
                />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{cat.name}</Text>
                <Text style={styles.categorySub}>{cat.sub}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Most Popular Products Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.popularTitleWrapper}>
            <Text style={styles.sectionTitle}>Produk Terpopuler</Text>
            <View style={styles.bestSellerBadge}>
              <Text style={styles.bestSellerText}>Best Seller</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('CatalogTab')}
            style={styles.seeAllBtn}
          >
            <Text style={styles.seeAllText}>Semua</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Product Grid */}
        <View style={styles.productsRow}>
          {popularProducts.map((prod) => (
            <TouchableOpacity
              key={prod.id}
              style={styles.productCard}
              onPress={() =>
                navigation.navigate('ProductDetail', { productId: prod.id })
              }
              activeOpacity={0.8}
            >
              {/* Product Image Box */}
              <View style={styles.productImageBox}>
                <Image
                  source={prod.image}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <View style={styles.minPcsBadge}>
                  <Text style={styles.minPcsText}>Min. {prod.minPcs} pcs</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={11} color={COLORS.star} />
                  <Text style={styles.ratingText}>{prod.rating}</Text>
                </View>
              </View>

              {/* Product Info */}
              <View style={styles.productBody}>
                <Text style={styles.productName} numberOfLines={1}>
                  {prod.id === 'prod-2' ? 'Polo Shirt Lacoste' : 'Kemeja PDH / PDL'}
                </Text>
                <Text style={styles.productFabric} numberOfLines={1}>
                  {prod.id === 'prod-2' ? 'Lacoste Pique 24s' : 'American / Japan Drill'}
                </Text>

                <Text style={styles.priceLabel}>Mulai dari</Text>
                <Text style={styles.priceValue}>
                  Rp {prod.basePrice.toLocaleString('id-ID')}{' '}
                  <Text style={styles.perPcs}>/pcs</Text>
                </Text>

                <TouchableOpacity
                  style={styles.detailBtn}
                  onPress={() =>
                    navigation.navigate('ProductDetail', { productId: prod.id })
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.detailBtnText}>+ Detail</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Quality Guarantee Banner */}
        <View style={styles.qualityGuaranteeBox}>
          <View style={styles.qualityIconCircle}>
            <Ionicons name="ribbon-outline" size={22} color={COLORS.accentBlue} />
          </View>
          <View style={styles.qualityTextWrapper}>
            <Text style={styles.qualityTitle}>
              Garansi Kualitas Jahitan & Bordir
            </Text>
            <Text style={styles.qualitySub}>
              Revisi dan jaminan ketepatan waktu pengiriman hingga 100%.
            </Text>
          </View>
        </View>

        {/* Extra space for floating bottom tab bar */}
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
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingText: {
    fontSize: 12,
    color: COLORS.accentBlue,
    fontWeight: '700',
  },
  userName: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primaryNavy,
    marginTop: 2,
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.accentBlue,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
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
  promoBanner: {
    backgroundColor: '#CEE8F7',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 22,
  },
  bannerLeft: {
    flex: 1,
    zIndex: 2,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
    marginBottom: 8,
  },
  discountBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primaryNavy,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 11,
    color: '#334E68',
    lineHeight: 16,
    marginBottom: 12,
    maxWidth: 200,
  },
  orderNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryNavy,
    borderRadius: 20,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  orderNowBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  hangerWrapper: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    zIndex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accentBlue,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 22,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF6FB',
    gap: 10,
    ...SHADOWS.soft,
  },
  categoryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  categorySub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  popularTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bestSellerBadge: {
    backgroundColor: '#E0F2FE',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  bestSellerText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accentBlue,
  },
  productsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  productCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF6FB',
    ...SHADOWS.card,
  },
  productImageBox: {
    height: 125,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  productImage: {
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
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  productBody: {
    padding: 12,
  },
  productName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  productFabric: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 6,
  },
  priceLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.accentBlue,
    marginBottom: 8,
  },
  perPcs: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  detailBtn: {
    backgroundColor: '#EBF4F9',
    borderRadius: 16,
    paddingVertical: 7,
    alignItems: 'center',
  },
  detailBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  qualityGuaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4F9',
    borderRadius: 20,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E0EEF7',
    marginBottom: 16,
  },
  qualityIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qualityTextWrapper: {
    flex: 1,
  },
  qualityTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  qualitySub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 14,
  },
});

