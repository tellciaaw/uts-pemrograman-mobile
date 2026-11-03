import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Header } from '../components/Header';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EditProfileModal } from '../components/Modals';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderSummary'>;

export const OrderSummaryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderDraft } = route.params;
  const { user, createOrder } = useApp();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const basePriceTotal = orderDraft.basePricePerPcs * orderDraft.quantity;
  const embroideryFee = 10000 * orderDraft.quantity; // Rp 10.000 / pcs
  const discountPromo = Math.round(basePriceTotal * 0.15); // 15% discount
  const shippingCost = 65000;
  const totalEstimasi = basePriceTotal + embroideryFee - discountPromo + shippingCost;

  const sizeBreakdownText = `S: ${orderDraft.sizeBreakdown.S || 0} • M: ${
    orderDraft.sizeBreakdown.M || 0
  } • L: ${orderDraft.sizeBreakdown.L || 0} • XL: ${
    orderDraft.sizeBreakdown.XL || 0
  }${
    orderDraft.sizeBreakdown.XXL ? ` • XXL: ${orderDraft.sizeBreakdown.XXL}` : ''
  }`;

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderId = await createOrder(orderDraft);
      setIsSubmitting(false);
      navigation.replace('OrderConfirmation', { orderId });
    } catch (e) {
      setIsSubmitting(false);
      Alert.alert('Gagal', 'Terjadi kesalahan saat memproses pesanan.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <Header
        title="Ajukan Pesanan"
        showBack
        onBackPress={() => navigation.goBack()}
        onAvatarPress={() => navigation.navigate('MainTabs', { screen: 'ProfileTab' })}
      />

      {/* Subheader Progress */}
      <View style={styles.stepProgressContainer}>
        <View style={styles.badgeAndCheckRow}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Langkah 2 dari 2</Text>
          </View>
          <View style={styles.checkBadgeCircle}>
            <Ionicons name="checkmark" size={14} color={COLORS.white} />
          </View>
        </View>

        <Text style={styles.screenMainTitle}>Ringkasan Pesanan</Text>

        <View style={styles.dualProgressBars}>
          <View style={styles.barSegmentActive} />
          <View style={styles.barSegmentActive} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card 1: Rincian Produk & Spesifikasi */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="shirt-outline" size={16} color={COLORS.accentBlue} />
              <Text style={styles.cardHeaderTitle}>
                Rincian Produk & Spesifikasi
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.ubahLink}>Ubah</Text>
            </TouchableOpacity>
          </View>

          {/* Inner Product Highlight */}
          <View style={styles.innerProductBox}>
            <Image
              source={orderDraft.productImage}
              style={styles.innerThumb}
              resizeMode="cover"
            />
            <View style={styles.innerProdText}>
              <Text style={styles.innerProdName}>{orderDraft.productName}</Text>
              <Text style={styles.innerProdFabric}>
                Bahan: {orderDraft.fabric.name} Premium
              </Text>
              <View style={styles.colorIndicatorRow}>
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: orderDraft.color.hex },
                  ]}
                />
                <Text style={styles.colorNameText}>{orderDraft.color.name}</Text>
              </View>
            </View>
          </View>

          {/* Specs Rows */}
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Total Kuantitas</Text>
            <View style={styles.specValueRight}>
              <Text style={styles.specValueBold}>{orderDraft.quantity} Pcs</Text>
              <Text style={styles.specSub}>{sizeBreakdownText}</Text>
            </View>
          </View>

          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Aksen & Bordir</Text>
            <View style={styles.specValueRight}>
              <Text style={styles.specValueBold}>2 Titik Bordir Komputer</Text>
              <Text style={styles.specSub}>Dada Kiri & Punggung</Text>
            </View>
          </View>

          {/* Uploaded File Pill */}
          <View style={styles.fileVerifiedPill}>
            <Ionicons name="attach-outline" size={16} color={COLORS.primaryNavy} />
            <Text style={styles.verifiedFileName} numberOfLines={1}>
              {orderDraft.designFileName || 'logo-komunitas.png'}
            </Text>
            <View style={styles.verifiedTag}>
              <Ionicons name="checkmark-circle" size={13} color="#0088B5" />
              <Text style={styles.verifiedTagText}>Terverifikasi</Text>
            </View>
          </View>
        </View>

        {/* Card 2: Alamat Pengiriman & Kontak */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="bus-outline" size={16} color={COLORS.accentBlue} />
              <Text style={styles.cardHeaderTitle}>
                Alamat Pengiriman & Kontak
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowAddressModal(true)}>
              <Text style={styles.ubahLink}>Ubah</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressInfoRow}>
            <Ionicons name="person-outline" size={16} color={COLORS.textSecondary} />
            <View style={styles.addressInfoText}>
              <Text style={styles.recipientNameText}>{user.name}</Text>
              <Text style={styles.recipientPhoneText}>{user.phone}</Text>
            </View>
          </View>

          <View style={styles.addressInfoRow}>
            <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.addressFullText}>{user.address}</Text>
          </View>

          {/* Note Box */}
          <View style={styles.logisticsNoteBox}>
            <Ionicons name="chatbubble-outline" size={14} color={COLORS.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.noteTitle}>Catatan Produksi & Logistik</Text>
              <Text style={styles.noteDesc}>
                "{orderDraft.notes || 'Kirim setelah lolos QC garmen.'}"
              </Text>
            </View>
          </View>
        </View>

        {/* Card 3: Rincian Biaya */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderLeft}>
            <Ionicons name="receipt-outline" size={16} color={COLORS.accentBlue} />
            <Text style={styles.cardHeaderTitle}>Rincian Biaya</Text>
          </View>

          <View style={styles.costItemRow}>
            <Text style={styles.costLabel}>
              Harga Dasar ({orderDraft.quantity} x Rp{' '}
              {orderDraft.basePricePerPcs.toLocaleString('id-ID')})
            </Text>
            <Text style={styles.costVal}>
              Rp {basePriceTotal.toLocaleString('id-ID')}
            </Text>
          </View>

          <View style={styles.costItemRow}>
            <Text style={styles.costLabel}>Biaya Bordir Komputer (2 Titik)</Text>
            <Text style={styles.costVal}>
              Rp {embroideryFee.toLocaleString('id-ID')}
            </Text>
          </View>

          <View style={styles.costItemRow}>
            <View style={styles.discountRowLeft}>
              <Ionicons name="pricetag-outline" size={13} color={COLORS.accentBlue} />
              <Text style={styles.discountLabelText}>
                Promo Komunitas (Diskon 15%)
              </Text>
            </View>
            <Text style={styles.discountValueText}>
              -Rp {discountPromo.toLocaleString('id-ID')}
            </Text>
          </View>

          <View style={styles.costItemRow}>
            <Text style={styles.costLabel}>Estimasi Ongkir Ekspedisi</Text>
            <Text style={styles.costVal}>
              Rp {shippingCost.toLocaleString('id-ID')}
            </Text>
          </View>

          <View style={styles.costDivider} />

          <View style={styles.totalCostRow}>
            <View>
              <Text style={styles.totalCostTitle}>Total Estimasi</Text>
              <Text style={styles.totalCostSub}>Sudah termasuk PPN & QC</Text>
            </View>
            <Text style={styles.totalCostAmount}>
              Rp {totalEstimasi.toLocaleString('id-ID')}
            </Text>
          </View>
        </View>

        {/* Info Box: Sistem Uang Muka DP 50% */}
        <View style={styles.dpInfoBox}>
          <View style={styles.dpInfoCircle}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.accentBlue} />
          </View>
          <View style={styles.dpTextWrapper}>
            <Text style={styles.dpTitle}>Sistem Uang Muka (DP 50%)</Text>
            <Text style={styles.dpSubtitle}>
              Pembayaran DP 50% setelah konfirmasi tim produksi. Pelunasan dilakukan saat pesanan siap dikirim.
            </Text>
          </View>
        </View>

        {/* Confirm Order Button */}
        <TouchableOpacity
          style={styles.confirmOrderBtn}
          onPress={handleConfirmOrder}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmOrderBtnText}>
            Konfirmasi Pesanan Sekarang
          </Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit Address Modal */}
      <EditProfileModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  stepProgressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  badgeAndCheckRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepBadge: {
    backgroundColor: '#E0F2FE',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
  },
  checkBadgeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0088B5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenMainTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primaryNavy,
    marginBottom: 10,
  },
  dualProgressBars: {
    flexDirection: 'row',
    gap: 8,
  },
  barSegmentActive: {
    flex: 1,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#006D94',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.card,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  ubahLink: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accentBlue,
  },
  innerProductBox: {
    flexDirection: 'row',
    backgroundColor: '#EBF4F9',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  innerThumb: {
    width: 58,
    height: 58,
    borderRadius: 16,
    marginRight: 12,
  },
  innerProdText: {
    flex: 1,
  },
  innerProdName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  innerProdFabric: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginVertical: 2,
  },
  colorIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  colorNameText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  specLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  specValueRight: {
    alignItems: 'flex-end',
  },
  specValueBold: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  specSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  fileVerifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4F9',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
    gap: 8,
  },
  verifiedFileName: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0088B5',
  },
  addressInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  addressInfoText: {
    flex: 1,
  },
  recipientNameText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  recipientPhoneText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  addressFullText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  logisticsNoteBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F7FB',
    borderRadius: 14,
    padding: 10,
    marginTop: 6,
    gap: 8,
  },
  noteTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  noteDesc: {
    fontSize: 11,
    color: COLORS.primaryNavy,
    fontStyle: 'italic',
    marginTop: 2,
  },
  costItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  costLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  costVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  discountRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  discountLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accentBlue,
  },
  discountValueText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.accentBlue,
  },
  costDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  totalCostRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalCostTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  totalCostSub: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  totalCostAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primaryNavy,
  },
  dpInfoBox: {
    flexDirection: 'row',
    backgroundColor: '#EBF4F9',
    borderRadius: 20,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E0EEF7',
    marginBottom: 16,
  },
  dpInfoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D7EBF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dpTextWrapper: {
    flex: 1,
  },
  dpTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginBottom: 3,
  },
  dpSubtitle: {
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  confirmOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryNavy,
    borderRadius: 24,
    height: 50,
    gap: 8,
    ...SHADOWS.soft,
  },
  confirmOrderBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
});

