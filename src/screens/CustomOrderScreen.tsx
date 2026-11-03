import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SizeBreakdown, CustomOrderDraft } from '../types';
import { Header } from '../components/Header';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { PRODUCTS } from '../data/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomOrder'>;

export const CustomOrderScreen: React.FC<Props> = ({ route, navigation }) => {
  const { productId } = route.params;
  const { customOrderDraft, setCustomOrderDraft } = useApp();

  const product =
    PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];

  const initialDraft: CustomOrderDraft = customOrderDraft || {
    productId: product.id,
    productName: product.name,
    productCategory: product.category,
    productImage: product.detailImage || product.image,
    fabric: product.fabrics[0],
    color: product.colors[0],
    quantity: 24,
    sizeBreakdown: { S: 4, M: 8, L: 8, XL: 4, XXL: 0 },
    notes: 'Bordir logo di dada kiri ukuran 7cm, nama di dada kanan, kerah kancing tersembunyi, belahan samping rapi.',
    embroideryDetails: '2 Titik Bordir Komputer (Dada Kiri & Punggung)',
    basePricePerPcs: product.basePrice,
    designFileName: 'Logo_Perusahaan_Vector.png',
    designFileSize: '2.4 MB',
  };

  const [quantity, setQuantity] = useState<number>(initialDraft.quantity);
  const [sizes, setSizes] = useState<SizeBreakdown>(initialDraft.sizeBreakdown);
  const [notes, setNotes] = useState<string>(initialDraft.notes);
  const [designFileUri, setDesignFileUri] = useState<string | undefined>(
    initialDraft.designFileUri
  );
  const [designFileName, setDesignFileName] = useState<string | undefined>(
    initialDraft.designFileName || 'Logo_Perusahaan_Vector.png'
  );
  const [designFileSize, setDesignFileSize] = useState<string | undefined>(
    initialDraft.designFileSize || '2.4 MB'
  );

  const allocatedTotal =
    (sizes.S || 0) +
    (sizes.M || 0) +
    (sizes.L || 0) +
    (sizes.XL || 0) +
    (sizes.XXL || 0);

  const isSizesMatched = allocatedTotal === quantity;

  const handleQuickQty = (qty: number) => {
    setQuantity(qty);
    // Auto balance sizes proportionally
    const perSize = Math.floor(qty / 4);
    const rem = qty % 4;
    setSizes({
      S: perSize,
      M: perSize + rem,
      L: perSize,
      XL: perSize,
      XXL: 0,
    });
  };

  const updateSizeCount = (sizeKey: keyof SizeBreakdown, delta: number) => {
    const current = sizes[sizeKey] || 0;
    const nextVal = Math.max(0, current + delta);
    setSizes({ ...sizes, [sizeKey]: nextVal });
  };

  const pickImageFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Izin Diperlukan',
          'Izin galeri diperlukan untuk melampirkan foto atau desain.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setDesignFileUri(asset.uri);
        const fileName = asset.fileName || 'Desain_Custom_' + Date.now().toString().slice(-4) + '.png';
        setDesignFileName(fileName);
        const sizeMb = asset.fileSize ? (asset.fileSize / (1024 * 1024)).toFixed(1) + ' MB' : '1.8 MB';
        setDesignFileSize(sizeMb);
      }
    } catch (e) {
      console.warn('Error picking image', e);
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Izin Kamera',
          'Izin kamera diperlukan untuk memfoto desain pakaian.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setDesignFileUri(asset.uri);
        setDesignFileName('Foto_Kamera_Sampel.jpg');
        setDesignFileSize('2.1 MB');
      }
    } catch (e) {
      console.warn('Error launching camera', e);
    }
  };

  const handleNextStep = () => {
    if (quantity < 12) {
      Alert.alert(
        'Minimal Pemesanan',
        'Minimal pemesanan konveksi adalah 12 pcs.'
      );
      return;
    }

    if (!isSizesMatched) {
      Alert.alert(
        'Rincian Ukuran Belum Sesuai',
        `Total alokasi ukuran (${allocatedTotal} pcs) harus sama persis dengan total jumlah pesanan (${quantity} pcs).`
      );
      return;
    }

    const updatedDraft: CustomOrderDraft = {
      ...initialDraft,
      quantity,
      sizeBreakdown: sizes,
      notes,
      designFileUri,
      designFileName,
      designFileSize,
    };

    setCustomOrderDraft(updatedDraft);
    navigation.navigate('OrderSummary', { orderDraft: updatedDraft });
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

      {/* Step Indicator */}
      <View style={styles.stepProgressContainer}>
        <View style={styles.stepTextRow}>
          <Text style={styles.stepActiveLabel}>LANGKAH 1 DARI 2</Text>
          <Text style={styles.stepCategoryLabel}>Spesifikasi & Desain</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '50%' }]} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Selected Product Summary Card */}
        <View style={styles.productSummaryCard}>
          <Image
            source={initialDraft.productImage}
            style={styles.summaryThumb}
            resizeMode="cover"
          />
          <View style={styles.summaryTextWrapper}>
            <View style={styles.katalogPilihanBadge}>
              <Text style={styles.katalogPilihanText}>Katalog Pilihan</Text>
            </View>
            <Text style={styles.summaryTitle}>{initialDraft.productName}</Text>
            <Text style={styles.summarySub}>
              Bahan: {initialDraft.fabric.name} • Warna: {initialDraft.color.name}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editProductBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil-outline" size={16} color={COLORS.primaryNavy} />
          </TouchableOpacity>
        </View>

        {/* Jumlah Pesanan Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardTitleRow}>
            <View>
              <Text style={styles.cardTitle}>Jumlah Pesanan</Text>
              <Text style={styles.cardSubtitle}>
                Minimal pemesanan konveksi 12 pcs
              </Text>
            </View>
            <View style={styles.pcsPill}>
              <Text style={styles.pcsPillText}>Pcs</Text>
            </View>
          </View>

          {/* Stepper Control */}
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setQuantity(Math.max(12, quantity - 1))}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={20} color={COLORS.primaryNavy} />
            </TouchableOpacity>

            <View style={styles.stepperCenter}>
              <Text style={styles.stepperNumber}>{quantity}</Text>
              <Text style={styles.stepperPcsText}>pcs</Text>
            </View>

            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setQuantity(quantity + 1)}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color={COLORS.primaryNavy} />
            </TouchableOpacity>
          </View>

          {/* Quick Select Buttons */}
          <View style={styles.quickQtyRow}>
            {[12, 24, 50, 100].map((q) => {
              const isSelected = quantity === q;
              return (
                <TouchableOpacity
                  key={q}
                  style={[
                    styles.quickQtyPill,
                    isSelected && styles.quickQtyPillActive,
                  ]}
                  onPress={() => handleQuickQty(q)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.quickQtyText,
                      isSelected && styles.quickQtyTextActive,
                    ]}
                  >
                    {q === 100 ? '100+ pcs' : `${q} pcs`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Rincian Ukuran Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardTitleRow}>
            <View>
              <Text style={styles.cardTitle}>Rincian Ukuran</Text>
              <Text style={styles.cardSubtitle}>
                Alokasikan jumlah per ukuran standar
              </Text>
            </View>
            <View
              style={[
                styles.totalBadge,
                !isSizesMatched && styles.totalBadgeMismatch,
              ]}
            >
              <Text
                style={[
                  styles.totalBadgeText,
                  !isSizesMatched && styles.totalBadgeTextMismatch,
                ]}
              >
                Total: {allocatedTotal}/{quantity}
              </Text>
            </View>
          </View>

          <View style={styles.sizesGrid}>
            {[
              { key: 'S', label: 'Small' },
              { key: 'M', label: 'Medium' },
              { key: 'L', label: 'Large' },
              { key: 'XL', label: 'Extra L' },
            ].map((sz) => {
              const count = sizes[sz.key as keyof SizeBreakdown] || 0;
              return (
                <View key={sz.key} style={styles.sizeBox}>
                  <Text style={styles.sizeCode}>{sz.key}</Text>
                  <Text style={styles.sizeSubLabel}>{sz.label}</Text>

                  <View style={styles.sizeCounterRow}>
                    <TouchableOpacity
                      onPress={() =>
                        updateSizeCount(sz.key as keyof SizeBreakdown, -1)
                      }
                      style={styles.miniStepBtn}
                    >
                      <Ionicons name="remove" size={14} color={COLORS.primaryNavy} />
                    </TouchableOpacity>
                    <Text style={styles.sizeCountText}>{count}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        updateSizeCount(sz.key as keyof SizeBreakdown, 1)
                      }
                      style={styles.miniStepBtn}
                    >
                      <Ionicons name="add" size={14} color={COLORS.primaryNavy} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Upload Desain & Logo Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardTitleRow}>
            <View>
              <Text style={styles.cardTitle}>Upload Desain & Logo</Text>
              <Text style={styles.cardSubtitle}>
                Format JPG, PNG, PDF maks 10MB
              </Text>
            </View>
            <Ionicons name="cloud-upload-outline" size={22} color={COLORS.accentBlue} />
          </View>

          {/* Upload Dropzone */}
          <View style={styles.uploadDottedBox}>
            <View style={styles.paletteCircle}>
              <Ionicons name="color-palette-outline" size={22} color={COLORS.accentBlue} />
            </View>
            <Text style={styles.uploadTitle}>Lampirkan Desain Pakaian</Text>
            <Text style={styles.uploadSubtitle}>
              Sertakan file artwork logo, pola bordir, atau foto referensi model pakaian.
            </Text>

            <TouchableOpacity
              style={styles.galleryBtn}
              onPress={pickImageFromGallery}
              activeOpacity={0.8}
            >
              <Ionicons name="images-outline" size={18} color={COLORS.primaryNavy} />
              <Text style={styles.galleryBtnText}>Pilih dari Galeri</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cameraBtn}
              onPress={takePhotoWithCamera}
              activeOpacity={0.8}
            >
              <Ionicons name="camera-outline" size={18} color={COLORS.primaryNavy} />
              <Text style={styles.cameraBtnText}>Ambil Foto</Text>
            </TouchableOpacity>
          </View>

          {/* Attached File Preview Pill */}
          {designFileName ? (
            <View style={styles.attachedFilePill}>
              <View style={styles.fileIconWrapper}>
                <Ionicons name="document-text-outline" size={18} color={COLORS.accentBlue} />
              </View>
              <View style={styles.fileDetails}>
                <Text style={styles.attachedFileName} numberOfLines={1}>
                  {designFileName}
                </Text>
                <Text style={styles.attachedFileSize}>
                  {designFileSize || '2.4 MB'} • Terlampir
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setDesignFileName(undefined);
                  setDesignFileUri(undefined);
                }}
                style={styles.removeFileBtn}
              >
                <Ionicons name="close" size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {/* Catatan Khusus & Penempatan Bordir Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>
              Catatan Khusus & Penempatan Bordir
            </Text>
            <Ionicons name="create-outline" size={18} color={COLORS.accentBlue} />
          </View>

          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            maxLength={300}
            placeholder="Contoh: Bordir logo di dada kiri ukuran 7cm, nama di dada kanan, kerah kancing tersembunyi, belahan samping rapi..."
            placeholderTextColor={COLORS.textMuted}
            value={notes}
            onChangeText={setNotes}
          />

          <View style={styles.notesFooterRow}>
            <View style={styles.proofingInfo}>
              <Ionicons name="information-circle-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.proofingText}>Revisi digital proofing gratis 2x</Text>
            </View>
            <Text style={styles.charCountText}>{notes.length}/300 kata</Text>
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextStepBtn}
          onPress={handleNextStep}
          activeOpacity={0.8}
        >
          <Text style={styles.nextStepBtnText}>Lanjutkan ke Ringkasan</Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
        </TouchableOpacity>

        <Text style={styles.instantEstimateNotice}>
          Estimasi penawaran harga instan di langkah berikutnya
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  stepTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  stepActiveLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.6,
  },
  stepCategoryLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0284C7',
    borderRadius: 3,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  productSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEF6FB',
    ...SHADOWS.soft,
  },
  summaryThumb: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  summaryTextWrapper: {
    flex: 1,
  },
  katalogPilihanBadge: {
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 3,
  },
  katalogPilihanText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0284C7',
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  summarySub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  editProductBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EBF4F9',
    justifyContent: 'center',
    alignItems: 'center',
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
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  cardSubtitle: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  pcsPill: {
    backgroundColor: '#E0F2FE',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pcsPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EBF4F9',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  stepperBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  stepperCenter: {
    alignItems: 'center',
  },
  stepperNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primaryNavy,
  },
  stepperPcsText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: -2,
  },
  quickQtyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickQtyPill: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  quickQtyPillActive: {
    backgroundColor: '#006D94',
  },
  quickQtyText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  quickQtyTextActive: {
    color: COLORS.white,
  },
  totalBadge: {
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  totalBadgeMismatch: {
    backgroundColor: COLORS.dangerBg,
  },
  totalBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
  },
  totalBadgeTextMismatch: {
    color: COLORS.danger,
  },
  sizesGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  sizeBox: {
    flex: 1,
    backgroundColor: '#EBF4F9',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  sizeCode: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  sizeSubLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  sizeCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  miniStepBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeCountText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.primaryNavy,
    minWidth: 16,
    textAlign: 'center',
  },
  uploadDottedBox: {
    backgroundColor: '#EBF4F9',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  paletteCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D7EBF8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 14,
    maxWidth: 260,
  },
  galleryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 20,
    width: '100%',
    height: 42,
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  galleryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  cameraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    width: '100%',
    height: 42,
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cameraBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  attachedFilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4F9',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  fileIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileDetails: {
    flex: 1,
  },
  attachedFileName: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  attachedFileSize: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  removeFileBtn: {
    padding: 4,
  },
  textArea: {
    backgroundColor: '#EBF4F9',
    borderRadius: 16,
    padding: 12,
    fontSize: 11,
    color: COLORS.textPrimary,
    lineHeight: 16,
    height: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notesFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  proofingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  proofingText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  charCountText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  nextStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3E5063',
    borderRadius: 24,
    height: 50,
    gap: 8,
    ...SHADOWS.soft,
  },
  nextStepBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  instantEstimateNotice: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
});

