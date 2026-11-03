import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderConfirmation'>;

export const OrderConfirmationScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const { orderId } = route.params;
  const { getOrderById } = useApp();

  const order = getOrderById(orderId);

  const handleCopyOrderNumber = () => {
    Alert.alert('Tersalin', `Nomor pesanan ${orderId} berhasil disalin ke clipboard.`);
  };

  const handleGoToTracking = () => {
    navigation.replace('OrderTracking', { orderId });
  };

  const handleBackToHome = () => {
    navigation.replace('MainTabs', { screen: 'HomeTab' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated/Success Top Icon */}
        <View style={styles.successIconSection}>
          <View style={styles.sparkleTopLeft}>
            <Ionicons name="sparkles" size={18} color="#38BDF8" />
          </View>
          <View style={styles.sparkleBottomRight}>
            <Ionicons name="flash" size={16} color="#38BDF8" />
          </View>

          <View style={styles.successCircleOuter}>
            <View style={styles.successCircleInner}>
              <Ionicons name="checkmark" size={38} color={COLORS.white} />
            </View>
          </View>
        </View>

        {/* Success Message Header */}
        <Text style={styles.mainTitle}>Pesanan Berhasil Diajukan!</Text>
        <Text style={styles.mainSubtitle}>
          Terima kasih! Pesanan konveksi Anda telah kami terima dan segera diverifikasi oleh tim produksi kami.
        </Text>

        {/* Order Details Card */}
        <View style={styles.detailsCard}>
          {/* Order ID Banner */}
          <View style={styles.orderIdBanner}>
            <View>
              <Text style={styles.orderIdLabel}>Nomor Pesanan</Text>
              <Text style={styles.orderIdValue}>{orderId}</Text>
            </View>
            <TouchableOpacity
              style={styles.copyBtn}
              onPress={handleCopyOrderNumber}
              activeOpacity={0.7}
            >
              <Ionicons name="copy-outline" size={14} color="#0284C7" />
              <Text style={styles.copyBtnText}>Salin</Text>
            </TouchableOpacity>
          </View>

          {/* Details Row 1: Item */}
          <View style={styles.detailRow}>
            <View style={styles.detailRowLeft}>
              <Ionicons name="shirt-outline" size={18} color={COLORS.textSecondary} />
              <Text style={styles.detailLabel}>Item</Text>
            </View>
            <Text style={styles.detailValueBold}>
              {order ? `${order.quantity} Pcs ${order.productName}` : '24 Pcs Kemeja PDH Drill'}
            </Text>
          </View>

          {/* Details Row 2: Production Estimation */}
          <View style={styles.detailRow}>
            <View style={styles.detailRowLeft}>
              <Ionicons name="time-outline" size={18} color={COLORS.textSecondary} />
              <Text style={styles.detailLabel}>Estimasi Produksi</Text>
            </View>
            <Text style={styles.detailValueBold}>
              {order?.estimatedCompletion || '7 - 10 Hari Kerja'}
            </Text>
          </View>

          {/* Details Row 3: Initial Status */}
          <View style={styles.detailRow}>
            <View style={styles.detailRowLeft}>
              <Ionicons name="clipboard-outline" size={18} color={COLORS.textSecondary} />
              <Text style={styles.detailLabel}>Status Awal</Text>
            </View>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusPillText}>
                {order?.status || 'Menunggu Verifikasi Desain'}
              </Text>
            </View>
          </View>

          {/* Bottom Total Estimation Highlight Box */}
          <View style={styles.totalBox}>
            <View>
              <Text style={styles.totalBoxLabel}>Total Estimasi</Text>
              <Text style={styles.totalBoxSub}>Termasuk QC & Bordir</Text>
            </View>
            <Text style={styles.totalBoxPrice}>
              Rp {order ? order.totalPrice.toLocaleString('id-ID') : '2.207.000'}
            </Text>
          </View>
        </View>

        {/* Periodic Notification Information Card */}
        <View style={styles.infoNoticeCard}>
          <View style={styles.bellIconCircle}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.accentBlue} />
          </View>
          <View style={styles.infoNoticeText}>
            <Text style={styles.noticeTitle}>Pantau Berkala Tanpa Khawatir</Text>
            <Text style={styles.noticeDesc}>
              Notifikasi update status jahitan dan bordir akan dikirim secara berkala via aplikasi & WhatsApp resmi Konveksiku.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.trackOrderBtn}
          onPress={handleGoToTracking}
          activeOpacity={0.8}
        >
          <Text style={styles.trackOrderBtnText}>Lihat Status Pesanan</Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={handleBackToHome}
          activeOpacity={0.8}
        >
          <Text style={styles.homeBtnText}>Kembali ke Beranda</Text>
        </TouchableOpacity>
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
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  successIconSection: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  sparkleTopLeft: {
    position: 'absolute',
    top: -4,
    left: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkleBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCircleOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  successCircleInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primaryNavy,
    textAlign: 'center',
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 22,
    paddingHorizontal: 10,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.card,
  },
  orderIdBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EBF4F9',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  orderIdLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  orderIdValue: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.primaryNavy,
    marginTop: 1,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  detailRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  detailValueBold: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0284C7',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
  },
  totalBoxLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  totalBoxSub: {
    fontSize: 9,
    color: COLORS.textMuted,
  },
  totalBoxPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.accentBlue,
  },
  infoNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4F9',
    borderRadius: 20,
    padding: 14,
    gap: 12,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0EEF7',
  },
  bellIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D7EBF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoNoticeText: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  noticeDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 14,
  },
  trackOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryNavy,
    borderRadius: 24,
    height: 50,
    width: '100%',
    gap: 8,
    marginBottom: 10,
    ...SHADOWS.soft,
  },
  trackOrderBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  homeBtn: {
    height: 48,
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.soft,
  },
  homeBtnText: {
    color: COLORS.primaryNavy,
    fontSize: 13,
    fontWeight: '700',
  },
});

