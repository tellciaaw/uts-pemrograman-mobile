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
import { DocumentationPhotosModal } from '../components/Modals';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderTracking'>;

export const OrderTrackingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId } = route.params;
  const { getOrderById } = useApp();
  const [showDocPhotos, setShowDocPhotos] = useState(false);

  const order = getOrderById(orderId) || {
    id: orderId,
    createdAt: '18 Mei 2025',
    productId: 'prod-1',
    productName: 'Kemeja PDH / PDL Drill',
    productCategory: 'Kemeja',
    productImage: require('../../assets/images/product_kemeja_detail.png'),
    fabricName: 'American Drill Premium',
    colorName: 'Navy Blue',
    colorHex: '#1B2E4B',
    quantity: 24,
    sizeBreakdown: { S: 4, M: 8, L: 8, XL: 4, XXL: 0 },
    notes: 'Bordir logo dada kiri & punggung.',
    shippingAddress: 'Jl. Pretty No. 21, Princess',
    recipientName: 'Evelyn Wijaya',
    recipientPhone: '0812-3456-7890',
    basePriceTotal: 2280000,
    embroideryFee: 240000,
    discountPromo: 378000,
    shippingCost: 65000,
    totalPrice: 2207000,
    status: 'Sedang Diproduksi',
    statusCategory: 'diproses' as const,
    currentStageNumber: 3,
    estimatedCompletion: '25 Mei 2025',
    tailorDurationDays: 'Hari ke-3 dari 7',
    currentStageTitle: 'Bordir Komputer & Penjahitan Pola',
    trackingStages: [
      {
        stageNumber: 1,
        title: 'Pesanan Diterima',
        timestamp: '18 Mei, 09:30',
        description: 'Pembayaran DP 50% berhasil diverifikasi sistem kasir.',
        isCompleted: true,
        isInProgress: false,
      },
      {
        stageNumber: 2,
        title: 'Pesanan Dikonfirmasi & Proofing',
        timestamp: '18 Mei, 14:15',
        description: 'Approval mockup pola ukuran & benang bordir selesai oleh pemesan.',
        isCompleted: true,
        isInProgress: false,
      },
      {
        stageNumber: 3,
        title: 'Sedang Diproduksi (Potong & Jahit)',
        timestamp: '20 Mei, 10:00',
        badge: 'Sedang Berjalan',
        description:
          'Kain telah dipotong sesuai sizing chart, saat ini proses bordir logo dada & penjahitan komponen lengan.',
        isCompleted: false,
        isInProgress: true,
      },
      {
        stageNumber: 4,
        title: 'Pemeriksaan Kualitas (QC)',
        timestamp: 'Est. 23 Mei',
        description:
          'Pengecekan presisi jahitan, tarikan kancing, dan kerapian sisa benang.',
        isCompleted: false,
        isInProgress: false,
      },
      {
        stageNumber: 5,
        title: 'Siap Dikirim (Packing)',
        timestamp: 'Est. 24 Mei',
        description:
          'Steam uap bertekanan tinggi, pelipatan standar garmen, dan polybag per pcs.',
        isCompleted: false,
        isInProgress: false,
      },
      {
        stageNumber: 6,
        title: 'Pesanan Selesai / Terkirim',
        timestamp: 'Est. 25 Mei',
        description:
          'Penyerahan ke kurir kargo ekspedisi menuju alamat pemesan.',
        isCompleted: false,
        isInProgress: false,
      },
    ],
  };

  const handleContactForeman = () => {
    Alert.alert(
      'Hubungi Mandor Produksi',
      `Menghubungkan ke Mandor Jahit Workshop KONVEKSIKU untuk pesanan ${order.id}.\n\nWhatsApp: +62 812-3456-7890 (Pak Budi - Kepala Produksi)`,
      [
        {
          text: 'Buka Chat WhatsApp',
          onPress: () =>
            Alert.alert(
              'WhatsApp Terbuka',
              'Memulai chat dengan Mandor Produksi Konveksiku.'
            ),
        },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  const handleHelp = () => {
    Alert.alert(
      'Pusat Bantuan Tracking',
      'Tim customer service siap menjawab pertanyaan seputar tahapan bordir, penjahitan, dan jadwal kurir.'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <Header
        title="Lacak Produksi"
        showBack
        onBackPress={() => navigation.goBack()}
        onAvatarPress={() => navigation.navigate('MainTabs', { screen: 'ProfileTab' })}
      />

      {/* Live Status Subheader */}
      <View style={styles.liveStatusRow}>
        <View style={styles.liveStatusLeft}>
          <View style={styles.liveDot} />
          <Text style={styles.liveStatusText}>LIVE STATUS PRODUKSI</Text>
        </View>
        <TouchableOpacity
          style={styles.helpBtn}
          onPress={handleHelp}
          activeOpacity={0.7}
        >
          <Ionicons name="help-circle-outline" size={14} color={COLORS.primaryNavy} />
          <Text style={styles.helpBtnText}>Bantuan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary Card */}
        <View style={styles.orderSummaryCard}>
          <View style={styles.summaryTopRow}>
            <View style={styles.orderNumberPill}>
              <Text style={styles.orderNumberText}># {order.id}</Text>
            </View>
            <Image
              source={order.productImage}
              style={styles.productCircleThumb}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.summaryProductTitle}>{order.productName}</Text>
          <Text style={styles.summarySubTitle}>
            Pesanan Komunitas • Total {order.quantity} Pcs ({order.colorName})
          </Text>

          {/* 2 Stats Pills */}
          <View style={styles.statsPillsRow}>
            <View style={styles.statPillBox}>
              <Ionicons name="calendar-outline" size={18} color={COLORS.accentBlue} />
              <View>
                <Text style={styles.statPillLabel}>Estimasi Selesai</Text>
                <Text style={styles.statPillValue}>
                  {order.estimatedCompletion || '25 Mei 2025'}
                </Text>
              </View>
            </View>

            <View style={styles.statPillBox}>
              <Ionicons name="flash-outline" size={18} color={COLORS.accentBlue} />
              <View>
                <Text style={styles.statPillLabel}>Durasi Jahit</Text>
                <Text style={styles.statPillValue}>
                  {order.tailorDurationDays || 'Hari ke-3 dari 7'}
                </Text>
              </View>
            </View>
          </View>

          {/* Current Stage Highlight Box */}
          <View style={styles.currentStageCard}>
            <View style={styles.stageIconCircle}>
              <Ionicons name="cut-outline" size={18} color={COLORS.white} />
            </View>
            <View style={styles.currentStageTextWrapper}>
              <Text style={styles.currentStageLabel}>TAHAP SAAT INI</Text>
              <Text style={styles.currentStageTitle}>
                {order.currentStageTitle || 'Bordir Komputer & Penjahitan Pola'}
              </Text>
            </View>
            <Ionicons name="sync-outline" size={18} color={COLORS.accentBlue} />
          </View>
        </View>

        {/* Timeline Production Card */}
        <View style={styles.timelineCard}>
          <View style={styles.timelineHeader}>
            <View>
              <Text style={styles.timelineTitle}>Progres Pengerjaan Garmen</Text>
              <Text style={styles.timelineSub}>
                Dipantau real-time dari lantai produksi
              </Text>
            </View>
            <View style={styles.tahapanBadge}>
              <Text style={styles.tahapanBadgeText}>6 Tahapan</Text>
            </View>
          </View>

          {/* 6 Stages Timeline Items */}
          {order.trackingStages.map((stage, idx) => {
            const isLast = idx === order.trackingStages.length - 1;
            return (
              <View key={stage.stageNumber} style={styles.stageItemContainer}>
                {/* Left Line & Node */}
                <View style={styles.stageNodeCol}>
                  {stage.isCompleted ? (
                    <View style={styles.completedNode}>
                      <Ionicons name="checkmark" size={12} color={COLORS.white} />
                    </View>
                  ) : stage.isInProgress ? (
                    <View style={styles.inProgressNodeOuter}>
                      <View style={styles.inProgressNodeInner} />
                    </View>
                  ) : (
                    <View style={styles.pendingNode} />
                  )}

                  {!isLast ? (
                    <View
                      style={[
                        styles.connectorLine,
                        stage.isCompleted && styles.connectorLineCompleted,
                      ]}
                    />
                  ) : null}
                </View>

                {/* Right Stage Content */}
                <View style={styles.stageContentCol}>
                  {stage.isInProgress ? (
                    // Highlighted Active Stage Box
                    <View style={styles.activeStageHighlightBox}>
                      <View style={styles.activeStageTopRow}>
                        <View style={styles.activeRunningBadge}>
                          <Text style={styles.activeRunningBadgeText}>
                            Sedang Berjalan
                          </Text>
                        </View>
                        <Text style={styles.activeTimestamp}>
                          {stage.timestamp}
                        </Text>
                      </View>

                      <Text style={styles.activeStageTitle}>{stage.title}</Text>
                      <Text style={styles.activeStageDesc}>
                        {stage.description}
                      </Text>

                      {/* Workstation Photos Button */}
                      <TouchableOpacity
                        style={styles.docPhotosBtn}
                        onPress={() => setShowDocPhotos(true)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="camera-outline" size={16} color={COLORS.accentBlue} />
                        <Text style={styles.docPhotosBtnText}>
                          Dokumentasi Meja Kerja (2 Foto)
                        </Text>
                        <Ionicons name="chevron-forward" size={14} color={COLORS.accentBlue} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    // Standard Completed or Pending Step
                    <View style={styles.standardStageBox}>
                      <View style={styles.standardStageTopRow}>
                        <Text
                          style={[
                            styles.standardStageTitle,
                            stage.isCompleted && styles.completedStageTitle,
                          ]}
                        >
                          {stage.title}
                        </Text>
                        <Text style={styles.standardTimestamp}>
                          {stage.timestamp}
                        </Text>
                      </View>
                      <Text style={styles.standardStageDesc}>
                        {stage.description}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* 14 Days Stitch Warranty Box */}
        <View style={styles.warrantyBox}>
          <View style={styles.warrantyIconCircle}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.accentBlue} />
          </View>
          <View style={styles.warrantyTextWrapper}>
            <Text style={styles.warrantyTitle}>Garansi Jahitan 14 Hari</Text>
            <Text style={styles.warrantySub}>
              Jika terdapat jahitan lepas atau kancing cacat, kami reparasi gratis tanpa ribet.
            </Text>
          </View>
        </View>

        {/* Bottom Floating WhatsApp Contact Button */}
        <TouchableOpacity
          style={styles.whatsappForemanBtn}
          onPress={handleContactForeman}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubbles-outline" size={20} color={COLORS.white} />
          <Text style={styles.whatsappForemanBtnText}>
            Hubungi Mandor Produksi (WhatsApp)
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Documentation Photos Modal */}
      <DocumentationPhotosModal
        visible={showDocPhotos}
        onClose={() => setShowDocPhotos(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  liveStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  liveStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0284C7',
  },
  liveStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.6,
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4F9',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  helpBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  orderSummaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.card,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumberPill: {
    backgroundColor: '#E0F2FE',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  orderNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
  },
  productCircleThumb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  summaryProductTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primaryNavy,
    marginBottom: 2,
  },
  summarySubTitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
  statsPillsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  statPillBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4F9',
    borderRadius: 16,
    padding: 10,
    gap: 8,
  },
  statPillLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
  },
  statPillValue: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginTop: 1,
  },
  currentStageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  stageIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#006D94',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentStageTextWrapper: {
    flex: 1,
  },
  currentStageLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  currentStageTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginTop: 1,
  },
  timelineCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.card,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  timelineSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tahapanBadge: {
    backgroundColor: '#D7EBF8',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tahapanBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  stageItemContainer: {
    flexDirection: 'row',
  },
  stageNodeCol: {
    alignItems: 'center',
    width: 28,
  },
  completedNode: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#93C5FD',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  inProgressNodeOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  inProgressNodeInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#006D94',
  },
  pendingNode: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    zIndex: 2,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  connectorLineCompleted: {
    backgroundColor: '#93C5FD',
  },
  stageContentCol: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 16,
  },
  activeStageHighlightBox: {
    backgroundColor: '#EBF4F9',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0EEF7',
  },
  activeStageTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeRunningBadge: {
    backgroundColor: '#006D94',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  activeRunningBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.white,
  },
  activeTimestamp: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  activeStageTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginTop: 4,
    marginBottom: 2,
  },
  activeStageDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 14,
    marginBottom: 10,
  },
  docPhotosBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  docPhotosBtnText: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  standardStageBox: {
    paddingVertical: 2,
  },
  standardStageTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  standardStageTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  completedStageTitle: {
    color: COLORS.primaryNavy,
    fontWeight: '800',
  },
  standardTimestamp: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  standardStageDesc: {
    fontSize: 10,
    color: COLORS.textMuted,
    lineHeight: 14,
  },
  warrantyBox: {
    flexDirection: 'row',
    backgroundColor: '#EBF4F9',
    borderRadius: 20,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E0EEF7',
    marginBottom: 16,
  },
  warrantyIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D7EBF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warrantyTextWrapper: {
    flex: 1,
  },
  warrantyTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginBottom: 2,
  },
  warrantySub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 14,
  },
  whatsappForemanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryNavy,
    borderRadius: 24,
    height: 50,
    gap: 8,
    ...SHADOWS.soft,
  },
  whatsappForemanBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
});

