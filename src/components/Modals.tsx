import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';

// 1. SIZE CHART MODAL
interface SizeChartModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Tabel Standar Ukuran (cm)</Text>
              <Text style={styles.modalSubtitle}>Sesuai Standar Konveksi Indonesia</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, styles.headerText]}>Size</Text>
                <Text style={[styles.tableCell, styles.headerText]}>Lebar Dada</Text>
                <Text style={[styles.tableCell, styles.headerText]}>Panjang</Text>
                <Text style={[styles.tableCell, styles.headerText]}>Bahu</Text>
                <Text style={[styles.tableCell, styles.headerText]}>Lengan</Text>
              </View>
              {[
                { size: 'S', chest: '48 cm', len: '68 cm', sh: '43 cm', sl: '22 cm' },
                { size: 'M', chest: '51 cm', len: '70 cm', sh: '45 cm', sl: '23 cm' },
                { size: 'L', chest: '54 cm', len: '72 cm', sh: '47 cm', sl: '24 cm' },
                { size: 'XL', chest: '57 cm', len: '74 cm', sh: '49 cm', sl: '25 cm' },
                { size: 'XXL', chest: '60 cm', len: '76 cm', sh: '51 cm', sl: '26 cm' },
              ].map((row, i) => (
                <View
                  key={row.size}
                  style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}
                >
                  <Text style={[styles.tableCell, styles.boldCell]}>{row.size}</Text>
                  <Text style={styles.tableCell}>{row.chest}</Text>
                  <Text style={styles.tableCell}>{row.len}</Text>
                  <Text style={styles.tableCell}>{row.sh}</Text>
                  <Text style={styles.tableCell}>{row.sl}</Text>
                </View>
              ))}
            </View>

            <View style={styles.tipsBox}>
              <Ionicons name="information-circle" size={18} color={COLORS.accentBlue} />
              <Text style={styles.tipsText}>
                Toleransi jahitan konveksi ± 1-2 cm. Ukuran dapat dicampur bebas dalam satu pemesanan tanpa biaya tambahan.
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.primaryModalBtn} onPress={onClose}>
            <Text style={styles.primaryModalBtnText}>Tutup Panduan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// 2. CUSTOM SIZE MODAL
interface CustomSizeModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (customText: string) => void;
}

export const CustomSizeModal: React.FC<CustomSizeModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [chest, setChest] = useState('52');
  const [length, setLength] = useState('71');
  const [shoulder, setShoulder] = useState('46');
  const [sleeve, setSleeve] = useState('24');
  const [note, setNote] = useState('');

  const handleSave = () => {
    const summary = `Custom Size: Dada ${chest}cm, Pjg ${length}cm, Bahu ${shoulder}cm, Lengan ${sleeve}cm. ${note}`;
    onSave(summary);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Kustomisasi Ukuran Khusus</Text>
              <Text style={styles.modalSubtitle}>Buat pola jahit custom khusus pesanan Anda</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.inputGrid}>
              <View style={styles.gridCol}>
                <Text style={styles.fieldLabel}>Lebar Dada (cm)</Text>
                <TextInput
                  style={styles.modalInput}
                  keyboardType="numeric"
                  value={chest}
                  onChangeText={setChest}
                />
              </View>
              <View style={styles.gridCol}>
                <Text style={styles.fieldLabel}>Panjang Badan (cm)</Text>
                <TextInput
                  style={styles.modalInput}
                  keyboardType="numeric"
                  value={length}
                  onChangeText={setLength}
                />
              </View>
            </View>

            <View style={styles.inputGrid}>
              <View style={styles.gridCol}>
                <Text style={styles.fieldLabel}>Lebar Bahu (cm)</Text>
                <TextInput
                  style={styles.modalInput}
                  keyboardType="numeric"
                  value={shoulder}
                  onChangeText={setShoulder}
                />
              </View>
              <View style={styles.gridCol}>
                <Text style={styles.fieldLabel}>Panjang Lengan (cm)</Text>
                <TextInput
                  style={styles.modalInput}
                  keyboardType="numeric"
                  value={sleeve}
                  onChangeText={setSleeve}
                />
              </View>
            </View>

            <Text style={styles.fieldLabel}>Catatan Tambahan Pola</Text>
            <TextInput
              style={[styles.modalInput, styles.multilineInput]}
              multiline
              numberOfLines={3}
              placeholder="Contoh: Belahan samping 5cm, kerah tegak kaku..."
              value={note}
              onChangeText={setNote}
            />
          </ScrollView>

          <TouchableOpacity style={styles.primaryModalBtn} onPress={handleSave}>
            <Text style={styles.primaryModalBtnText}>Terapkan Ukuran Custom</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// 3. EDIT PROFILE MODAL
interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose }) => {
  const { user, updateProfile } = useApp();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Perhatian', 'Nama lengkap tidak boleh kosong');
      return;
    }
    await updateProfile({ name, email, phone, address });
    Alert.alert('Berhasil', 'Profil Anda berhasil diperbarui');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Edit Profil Pengguna</Text>
              <Text style={styles.modalSubtitle}>Ubah data kontak dan informasi akun</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.fieldLabel}>Nama Lengkap</Text>
            <TextInput
              style={styles.modalInput}
              value={name}
              onChangeText={setName}
              placeholder="Nama Lengkap"
            />

            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.modalInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="nama@email.com"
            />

            <Text style={styles.fieldLabel}>Nomor WhatsApp / HP</Text>
            <TextInput
              style={styles.modalInput}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="0812-3456-7890"
            />

            <Text style={styles.fieldLabel}>Alamat Pengiriman Utama</Text>
            <TextInput
              style={[styles.modalInput, styles.multilineInput]}
              multiline
              numberOfLines={3}
              value={address}
              onChangeText={setAddress}
              placeholder="Alamat lengkap penerima"
            />
          </ScrollView>

          <TouchableOpacity style={styles.primaryModalBtn} onPress={handleSave}>
            <Text style={styles.primaryModalBtnText}>Simpan Perubahan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// 4. DOCUMENTATION PHOTOS MODAL (For Meja Kerja Tracking)
interface DocumentationPhotosModalProps {
  visible: boolean;
  onClose: () => void;
}

export const DocumentationPhotosModal: React.FC<DocumentationPhotosModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Dokumentasi Meja Kerja</Text>
              <Text style={styles.modalSubtitle}>Foto live dari lantai potong & jahit</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.docItem}>
              <Image
                source={require('../../assets/images/thumb_fabric.png')}
                style={styles.docPhoto}
                resizeMode="cover"
              />
              <View style={styles.docInfo}>
                <Text style={styles.docTitle}>Pemotongan Bahan & Sizing Chart</Text>
                <Text style={styles.docDate}>20 Mei 2025 • 09:15 WIB</Text>
                <Text style={styles.docDesc}>
                  Pola kain American Drill dipotong presisi menggunakan laser cutter.
                </Text>
              </View>
            </View>

            <View style={styles.docItem}>
              <Image
                source={require('../../assets/images/thumb_patch.png')}
                style={styles.docPhoto}
                resizeMode="cover"
              />
              <View style={styles.docInfo}>
                <Text style={styles.docTitle}>Bordir Komputer Logo Dada</Text>
                <Text style={styles.docDate}>20 Mei 2025 • 11:40 WIB</Text>
                <Text style={styles.docDesc}>
                  Mesin bordir Tajima 12 kepala sedang menyulam badge logo komunitas.
                </Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.primaryModalBtn} onPress={onClose}>
            <Text style={styles.primaryModalBtnText}>Kembali ke Tracking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// 5. FABRIC GUIDE MODAL
interface FabricGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FabricGuideModal: React.FC<FabricGuideModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Panduan Karakteristik Bahan</Text>
              <Text style={styles.modalSubtitle}>Pilih jenis drill sesuai kebutuhan seragam</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {[
              {
                title: 'American Drill',
                desc: 'Serat sedang, tebal pas, tidak panas. Pilihan standar paling populer untuk kemeja dinas dan seragam lapangan harian.',
                tag: 'Standar Populer',
              },
              {
                title: 'Japan Drill',
                desc: 'Serat lebih halus dan tebal dengan tekstur jatuh elegan. Sangat tahan cuci berulang dan tidak mudah kusut.',
                tag: 'Tahan Gesekan',
              },
              {
                title: 'Nagata Drill',
                desc: 'Kandungan serat katun tinggi sehingga jauh lebih adem, menyerap keringat dengan baik, dan nyaman dipakai seharian.',
                tag: 'Adem & Lembut',
              },
              {
                title: 'Hisofy Drill',
                desc: 'Kasta tertinggi bahan drill dengan kelembutan selevel sutra katun, sirkulasi udara maksimal, dan warna mengilap eksklusif.',
                tag: 'Grade Premium',
              },
            ].map((f) => (
              <View key={f.title} style={styles.fabricCard}>
                <View style={styles.fabricTitleRow}>
                  <Text style={styles.fabricName}>{f.title}</Text>
                  <View style={styles.fabricBadge}>
                    <Text style={styles.fabricBadgeText}>{f.tag}</Text>
                  </View>
                </View>
                <Text style={styles.fabricDesc}>{f.desc}</Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.primaryModalBtn} onPress={onClose}>
            <Text style={styles.primaryModalBtnText}>Tutup Panduan Bahan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 40, 77, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    marginBottom: 16,
  },
  table: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 14,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tableRowAlt: {
    backgroundColor: '#F8FAFC',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  headerText: {
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  boldCell: {
    fontWeight: '800',
    color: COLORS.accentBlue,
  },
  tipsBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.pillBlue,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  tipsText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.pillText,
    lineHeight: 16,
  },
  primaryModalBtn: {
    backgroundColor: COLORS.primaryNavy,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryModalBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
  inputGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  gridCol: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryNavy,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  multilineInput: {
    height: 70,
    textAlignVertical: 'top',
  },
  docItem: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  docPhoto: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  docInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  docTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  docDate: {
    fontSize: 11,
    color: COLORS.accentBlue,
    marginVertical: 2,
    fontWeight: '600',
  },
  docDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  fabricCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fabricTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  fabricName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  fabricBadge: {
    backgroundColor: COLORS.pillBlue,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  fabricBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.pillText,
  },
  fabricDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
});

