import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
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
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  EditProfileModal,
  SizeChartModal,
} from '../components/Modals';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'ProfileTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, updateProfile, logout, orders } = useApp();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showSizeChartModal, setShowSizeChartModal] = useState(false);

  const activeOrdersCount = orders.filter((o) => o.statusCategory === 'diproses').length;
  const completedOrdersCount = orders.filter((o) => o.statusCategory === 'selesai').length;

  const handlePickAvatar = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Izin Galeri Diperlukan', 'Izinkan akses foto untuk mengubah foto profil.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0].uri) {
        await updateProfile({ avatarUri: result.assets[0].uri });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleToggleNotifications = async (val: boolean) => {
    await updateProfile({ notificationsEnabled: val });
  };

  const handleHelpCenter = () => {
    Alert.alert(
      'Pusat Bantuan & Konsultasi',
      'Layanan CS Konveksiku siap membantu Anda via WhatsApp di +62 812-3456-7890 (Pukul 08:00 - 21:00 WIB).',
      [
        {
          text: 'Hubungi Sekarang',
          onPress: () =>
            Alert.alert('Menghubungkan', 'Mengarahkan ke live support Konveksiku...'),
        },
        { text: 'Tutup', style: 'cancel' },
      ]
    );
  };

  const handleWarrantyPolicy = () => {
    Alert.alert(
      'Syarat & Garansi Retur Jahit',
      '1. Garansi jahitan dan bordir berlaku 14 hari kerja setelah barang diterima.\n\n2. Gratis revisi & perbaikan jika ditemukan cacat pola jahit atau bordir yang tidak sesuai pesanan.\n\n3. Penggantian 100% bahan jika ada kesalahan spesifikasi warna atau jenis kain oleh pihak kami.'
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Keluar dari Akun',
      'Apakah Anda yakin ingin keluar dari akun KONVEKSIKU?',
      [
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          },
        },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <Header
        title="Profil"
        subtitle="KONVEKSIKU"
        onAvatarPress={() => setShowEditProfileModal(true)}
      />

      {/* Subheader */}
      <View style={styles.subHeaderRow}>
        <View>
          <Text style={styles.subHeaderCategory}>AKUN PERSONAL</Text>
          <Text style={styles.subHeaderTitle}>Profil Pengguna</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => setShowEditProfileModal(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={18} color={COLORS.primaryNavy} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main User Card */}
        <View style={styles.userCard}>
          {/* Avatar with Edit Badge */}
          <View style={styles.avatarWrapper}>
            <Image
              source={
                user.avatarUri
                  ? { uri: user.avatarUri }
                  : require('../../assets/images/user_avatar.png')
              }
              style={styles.avatarImg}
            />
            <TouchableOpacity
              style={styles.editAvatarBadge}
              onPress={handlePickAvatar}
              activeOpacity={0.8}
            >
              <Ionicons name="pencil" size={12} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userNameText}>{user.name}</Text>

          {/* Verified Badge */}
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedBadgeText}>Pelanggan Terverifikasi</Text>
            <Ionicons name="star" size={12} color={COLORS.star} />
          </View>

          {/* Contact Details */}
          <View style={styles.contactDetailsRow}>
            <Ionicons name="mail-outline" size={13} color={COLORS.textSecondary} />
            <Text style={styles.contactDetailText}>{user.email}</Text>
            <View style={styles.dotSeparator} />
            <Ionicons name="call-outline" size={13} color={COLORS.textSecondary} />
            <Text style={styles.contactDetailText}>{user.phone}</Text>
          </View>

          {/* 2 Stat Cards */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <View style={styles.statIconRow}>
                <Ionicons name="shield-checkmark" size={16} color={COLORS.accentBlue} />
                <Text style={styles.statNumber}>
                  {user.completedOrdersCount || completedOrdersCount || 8}
                </Text>
              </View>
              <Text style={styles.statLabel}>Pesanan Selesai</Text>
            </View>

            <View style={styles.statBox}>
              <View style={styles.statIconRow}>
                <Ionicons name="sync" size={16} color={COLORS.accentBlue} />
                <Text style={styles.statNumber}>
                  {activeOrdersCount || 2}
                </Text>
              </View>
              <Text style={styles.statLabel}>Sedang Berjalan</Text>
            </View>
          </View>
        </View>

        {/* Section 1: AKUN & PEMESANAN */}
        <Text style={styles.sectionHeaderTitle}>AKUN & PEMESANAN</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowEditProfileModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconCircle}>
              <Ionicons name="person-outline" size={18} color={COLORS.accentBlue} />
            </View>
            <View style={styles.menuTextWrapper}>
              <Text style={styles.menuTitle}>Edit Profil</Text>
              <Text style={styles.menuSub}>Biodata, foto & kontak utama</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('OrdersTab')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconCircle}>
              <Ionicons name="bag-handle-outline" size={18} color={COLORS.accentBlue} />
            </View>
            <View style={styles.menuTextWrapper}>
              <Text style={styles.menuTitle}>Pesanan Saya</Text>
              <Text style={styles.menuSub}>Riwayat transaksi & status jahit</Text>
            </View>
            <View style={styles.activeOrdersCountPill}>
              <Text style={styles.activeOrdersCountText}>
                {activeOrdersCount} Aktif
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowEditProfileModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconCircle}>
              <Ionicons name="location-outline" size={18} color={COLORS.accentBlue} />
            </View>
            <View style={styles.menuTextWrapper}>
              <Text style={styles.menuTitle}>Buku Alamat Pengiriman</Text>
              <Text style={styles.menuSub}>Alamat kantor, rumah & cabang</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.lastMenuItem]}
            onPress={() => setShowSizeChartModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconCircle}>
              <Ionicons name="file-tray-full-outline" size={18} color={COLORS.accentBlue} />
            </View>
            <View style={styles.menuTextWrapper}>
              <Text style={styles.menuTitle}>Tabel Ukuran & Custom Size Saya</Text>
              <Text style={styles.menuSub}>Master ukuran seragam & sampel</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Section 2: PENGATURAN & BANTUAN */}
        <Text style={styles.sectionHeaderTitle}>PENGATURAN & BANTUAN</Text>
        <View style={styles.menuContainer}>
          <View style={styles.menuItem}>
            <View style={styles.menuIconCircle}>
              <Ionicons name="notifications-outline" size={18} color={COLORS.accentBlue} />
            </View>
            <View style={styles.menuTextWrapper}>
              <Text style={styles.menuTitle}>Notifikasi Status Jahitan</Text>
              <Text style={styles.menuSub}>Pembaruan tiap tahap produksi</Text>
            </View>
            <Switch
              value={user.notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#CBD5E1', true: '#006D94' }}
              thumbColor={COLORS.white}
            />
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleHelpCenter}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconCircle}>
              <Ionicons name="help-circle-outline" size={18} color={COLORS.accentBlue} />
            </View>
            <View style={styles.menuTextWrapper}>
              <Text style={styles.menuTitle}>Pusat Bantuan & Konsultasi</Text>
              <Text style={styles.menuSub}>Tanya bahan, sablon, & CS Konveksi</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.lastMenuItem]}
            onPress={handleWarrantyPolicy}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconCircle}>
              <Ionicons name="shield-outline" size={18} color={COLORS.accentBlue} />
            </View>
            <View style={styles.menuTextWrapper}>
              <Text style={styles.menuTitle}>Syarat & Garansi Retur Jahit</Text>
              <Text style={styles.menuSub}>Jaminan 100% kepuasan mutu</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color="#DC2626" />
          <Text style={styles.logoutBtnText}>Keluar dari Akun</Text>
        </TouchableOpacity>

        {/* Footer Brand Info */}
        <View style={styles.footerBrand}>
          <Text style={styles.footerBrandText}>
            KONVEKSIKU v1.0.0 • Made with Precision
          </Text>
          <Text style={styles.footerBrandSub}>
            Platform Konveksi & Garmen Digital Terpercaya
          </Text>
        </View>

        {/* Extra space for floating bottom navigation */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
      />

      {/* Size Chart Modal */}
      <SizeChartModal
        visible={showSizeChartModal}
        onClose={() => setShowSizeChartModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  subHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginBottom: 8,
  },
  subHeaderCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.8,
  },
  subHeaderTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primaryNavy,
    marginTop: 1,
  },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  userCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.card,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarImg: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2,
    borderColor: '#BAE6FD',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#006D94',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userNameText: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.primaryNavy,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 3,
    gap: 4,
    marginTop: 4,
    marginBottom: 8,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  contactDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  contactDetailText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textMuted,
    marginHorizontal: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  statBox: {
    flex: 1,
    backgroundColor: '#EBF4F9',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primaryNavy,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    paddingHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    gap: 12,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF4F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextWrapper: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  menuSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  activeOrdersCountPill: {
    backgroundColor: '#DBEAFE',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
  },
  activeOrdersCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E40AF',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 22,
    height: 48,
    gap: 8,
    marginBottom: 20,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#DC2626',
  },
  footerBrand: {
    alignItems: 'center',
    marginBottom: 10,
  },
  footerBrandText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  footerBrandSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});

