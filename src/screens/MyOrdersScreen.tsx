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
import { RootStackParamList, MainTabParamList, Order } from '../types';
import { Header } from '../components/Header';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'OrdersTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

type StatusFilter = 'semua' | 'diproses' | 'selesai' | 'dibatalkan';

export const MyOrdersScreen: React.FC<Props> = ({ navigation }) => {
  const { orders, setCustomOrderDraft } = useApp();
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('diproses');
  const [searchQuery, setSearchQuery] = useState('');

  const diprosesOrders = orders.filter((o) => o.statusCategory === 'diproses');
  const selesaiOrders = orders.filter((o) => o.statusCategory === 'selesai');
  const dibatalkanOrders = orders.filter((o) => o.statusCategory === 'dibatalkan');

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === 'semua' || order.statusCategory === activeFilter;

    const matchesSearch =
      searchQuery.trim() === '' ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleReorder = (order: Order) => {
    Alert.alert(
      'Pesan Lagi',
      `Buat pesanan baru untuk ${order.productName} dengan spesifikasi yang sama?`,
      [
        {
          text: 'Lanjutkan',
          onPress: () => {
            navigation.navigate('ProductDetail', { productId: order.productId });
          },
        },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  const handleContactQC = () => {
    Alert.alert(
      'Garansi Kerapian 100%',
      'Layanan Quality Control dan Revisi Garansi siap melayani Anda melalui WhatsApp Konveksiku (0812-3456-7890).'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <Header
        title="Pesanan"
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
              placeholder="Cari nomor pesanan atau produk..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setActiveFilter('semua')}
            activeOpacity={0.7}
          >
            <Ionicons name="options-outline" size={20} color={COLORS.accentBlue} />
          </TouchableOpacity>
        </View>

        {/* Status Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsScroll}
        >
          {[
            { key: 'semua', label: `Semua ${orders.length}` },
            { key: 'diproses', label: `Diproses ${diprosesOrders.length}` },
            { key: 'selesai', label: `Selesai ${selesaiOrders.length}` },
            { key: 'dibatalkan', label: `Dibatalkan ${dibatalkanOrders.length}` },
          ].map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                onPress={() => setActiveFilter(tab.key as StatusFilter)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabChipText,
                    isActive && styles.tabChipTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="cube-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyStateTitle}>Tidak Ada Pesanan</Text>
            <Text style={styles.emptyStateSub}>
              Tidak ditemukan pesanan pada kategori ini.
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const isCompleted = order.statusCategory === 'selesai';
            return (
              <View key={order.id} style={styles.orderCard}>
                {/* Order Top Meta */}
                <View style={styles.orderMetaHeader}>
                  <Text style={styles.orderNumberAndDate}>
                    {order.id} • {order.createdAt}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      isCompleted && styles.statusBadgeCompleted,
                    ]}
                  >
                    {isCompleted ? (
                      <Ionicons
                        name="checkmark"
                        size={12}
                        color="#0284C7"
                        style={{ marginRight: 2 }}
                      />
                    ) : (
                      <View style={styles.blueDot} />
                    )}
                    <Text
                      style={[
                        styles.statusBadgeText,
                        isCompleted && styles.statusBadgeTextCompleted,
                      ]}
                    >
                      {order.status}
                    </Text>
                  </View>
                </View>

                {/* Product Info Row */}
                <View style={styles.productRow}>
                  <Image
                    source={order.productImage}
                    style={styles.productThumb}
                    resizeMode="cover"
                  />
                  <View style={styles.productMetaText}>
                    <Text style={styles.orderProductName} numberOfLines={1}>
                      {order.productName}
                    </Text>
                    <Text style={styles.orderQuantityText}>
                      Jumlah: {order.quantity} Pcs • {order.fabricName}
                    </Text>

                    {/* Stage icon row */}
                    <View style={styles.stageIndicatorRow}>
                      <Ionicons
                        name={
                          isCompleted
                            ? 'bus-outline'
                            : 'sync-outline'
                        }
                        size={13}
                        color={COLORS.accentBlue}
                      />
                      <Text style={styles.stageTitleText}>
                        {order.currentStageTitle || 'Proses Penjahitan (Tahap 4/6)'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Footer: Price & Action */}
                <View style={styles.orderCardFooter}>
                  <View>
                    <Text style={styles.totalPriceLabel}>
                      {isCompleted ? 'Total Selesai' : 'Total Tagihan'}
                    </Text>
                    <Text style={styles.totalPriceValue}>
                      Rp {order.totalPrice.toLocaleString('id-ID')}
                    </Text>
                  </View>

                  {isCompleted ? (
                    <TouchableOpacity
                      style={styles.reorderBtn}
                      onPress={() => handleReorder(order)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name="refresh-outline"
                        size={14}
                        color={COLORS.primaryNavy}
                      />
                      <Text style={styles.reorderBtnText}>Pesan Lagi</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.trackBtn}
                      onPress={() =>
                        navigation.navigate('OrderTracking', { orderId: order.id })
                      }
                      activeOpacity={0.8}
                    >
                      <Text style={styles.trackBtnText}>Lacak Jahit</Text>
                      <Ionicons
                        name="arrow-forward"
                        size={14}
                        color={COLORS.white}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}

        {/* Bottom Banner Garansi Kerapian 100% */}
        <View style={styles.guaranteeCard}>
          <View style={styles.guaranteeIconCircle}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.accentBlue} />
          </View>
          <View style={styles.guaranteeTextWrapper}>
            <Text style={styles.guaranteeTitle}>Garansi Kerapian 100%</Text>
            <Text style={styles.guaranteeSub}>
              Ada cacat jahitan? Kami revisi gratis hingga sempurna.
            </Text>
          </View>
          <TouchableOpacity onPress={handleContactQC}>
            <Text style={styles.qcContactLink}>Hubungi QC</Text>
          </TouchableOpacity>
        </View>

        {/* Extra space for floating bottom navigation */}
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
  filterTabsScroll: {
    gap: 8,
    marginBottom: 16,
    paddingVertical: 2,
  },
  tabChip: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabChipActive: {
    backgroundColor: COLORS.primaryNavy,
    borderColor: COLORS.primaryNavy,
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabChipTextActive: {
    color: COLORS.white,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.card,
  },
  orderMetaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumberAndDate: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    gap: 4,
  },
  statusBadgeCompleted: {
    backgroundColor: '#E0F2FE',
  },
  blueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0284C7',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
  },
  statusBadgeTextCompleted: {
    color: '#0284C7',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productThumb: {
    width: 58,
    height: 58,
    borderRadius: 16,
    marginRight: 12,
  },
  productMetaText: {
    flex: 1,
  },
  orderProductName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  orderQuantityText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginVertical: 2,
  },
  stageIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  stageTitleText: {
    fontSize: 11,
    color: COLORS.accentBlue,
    fontWeight: '600',
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  totalPriceLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  totalPriceValue: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.primaryNavy,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryNavy,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    gap: 6,
  },
  trackBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    gap: 6,
  },
  reorderBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  guaranteeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4F9',
    borderRadius: 20,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E0EEF7',
    marginBottom: 16,
  },
  guaranteeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D7EBF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guaranteeTextWrapper: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  guaranteeSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 14,
  },
  qcContactLink: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.accentBlue,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginTop: 10,
  },
  emptyStateSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});

