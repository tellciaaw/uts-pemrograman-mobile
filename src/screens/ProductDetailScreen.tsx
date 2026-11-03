import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, FabricOption, ColorOption } from '../types';
import { Header } from '../components/Header';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/mockData';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  SizeChartModal,
  CustomSizeModal,
  FabricGuideModal,
} from '../components/Modals';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { productId } = route.params;
  const { favorites, toggleFavorite, setCustomOrderDraft } = useApp();

  const product =
    PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];

  const [selectedFabric, setSelectedFabric] = useState<FabricOption>(
    product.fabrics[0]
  );
  const [selectedColor, setSelectedColor] = useState<ColorOption>(
    product.colors[0]
  );
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [customSizeText, setCustomSizeText] = useState<string>('');

  // Modals visibility
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showCustomSizeModal, setShowCustomSizeModal] = useState(false);
  const [showFabricGuide, setShowFabricGuide] = useState(false);

  const isFav = favorites.includes(product.id);

  const unitPrice = product.basePrice + selectedFabric.priceModifier;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Pesan custom ${product.name} di KONVEKSIKU dengan harga mulai Rp ${product.basePrice.toLocaleString('id-ID')} /pcs!`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleProceedToCustomOrder = () => {
    // initialize draft order
    setCustomOrderDraft({
      productId: product.id,
      productName: product.name,
      productCategory: product.category,
      productImage: product.detailImage || product.image,
      fabric: selectedFabric,
      color: selectedColor,
      quantity: 24, // default 24 pcs
      sizeBreakdown: { S: 4, M: 8, L: 8, XL: 4, XXL: 0 },
      notes: customSizeText ? `Catatan Ukuran Khusus: ${customSizeText}` : '',
      embroideryDetails: '2 Titik Bordir Komputer (Dada Kiri & Punggung)',
      basePricePerPcs: unitPrice,
    });

    navigation.navigate('CustomOrder', { productId: product.id });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header */}
      <Header
        title="Detail Produk"
        showBack
        onBackPress={() => navigation.goBack()}
        onAvatarPress={() => navigation.navigate('MainTabs', { screen: 'ProfileTab' })}
      />

      {/* Guarantee & Actions Subheader Bar */}
      <View style={styles.subActionBar}>
        <View style={styles.garansiBadge}>
          <Ionicons name="shield-checkmark" size={14} color={COLORS.accentBlue} />
          <Text style={styles.garansiBadgeText}>Garansi Konveksi</Text>
        </View>

        <View style={styles.actionIconsRow}>
          <TouchableOpacity
            style={styles.circleActionBtn}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Ionicons name="share-social-outline" size={18} color={COLORS.primaryNavy} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.circleActionBtn}
            onPress={() => toggleFavorite(product.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={18}
              color={isFav ? COLORS.danger : COLORS.primaryNavy}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Product Image Card */}
        <View style={styles.imageCard}>
          <View style={styles.mainImageBox}>
            <Image
              source={product.detailImage || product.image}
              style={styles.mainImage}
              resizeMode="cover"
            />
            {/* Terlaris Badge */}
            <View style={styles.terlarisBadge}>
              <Ionicons name="flame" size={13} color="#38BDF8" />
              <Text style={styles.terlarisText}>Terlaris #1</Text>
            </View>

            {/* Rating Badge */}
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={13} color={COLORS.star} />
              <Text style={styles.ratingText}>
                {product.rating} ({product.reviewsCount} ulasan)
              </Text>
            </View>

            {/* Zoom Button */}
            <TouchableOpacity
              style={styles.zoomBtn}
              onPress={() =>
                Alert.alert('Lihat Foto', 'Menampilkan foto produk resolusi tinggi.')
              }
              activeOpacity={0.8}
            >
              <Ionicons name="search-outline" size={16} color={COLORS.primaryNavy} />
            </TouchableOpacity>
          </View>

          {/* Thumbnails Row */}
          <View style={styles.thumbnailsRow}>
            <Image
              source={require('../../assets/images/thumb_fabric.png')}
              style={styles.thumbImage}
            />
            <Image
              source={require('../../assets/images/thumb_back.png')}
              style={styles.thumbImage}
            />
            <Image
              source={require('../../assets/images/thumb_patch.png')}
              style={styles.thumbImage}
            />
            <TouchableOpacity
              style={styles.moreThumbsBtn}
              onPress={() =>
                Alert.alert('Galeri Produk', 'Tersedia 6 foto detail jahitan & serat kain.')
              }
              activeOpacity={0.7}
            >
              <Text style={styles.moreThumbsText}>+3 Foto</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Information Card */}
        <View style={styles.cardContainer}>
          <Text style={styles.categoryBadgeText}>
            KATEGORI {product.category.toUpperCase()}
          </Text>
          <Text style={styles.productTitle}>{product.name}</Text>

          <Text style={styles.priceHighlight}>
            Mulai Rp {unitPrice.toLocaleString('id-ID')}{' '}
            <Text style={styles.pricePerPcs}>/ pcs</Text>
          </Text>
          <Text style={styles.priceNote}>
            *(Tergantung jenis bahan kain, bordir & kuantiti total)
          </Text>

          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>

        {/* Pilihan Bahan Kain Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="layers-outline" size={18} color={COLORS.accentBlue} />
              <Text style={styles.cardHeaderTitle}>Pilihan Bahan Kain</Text>
            </View>
            <TouchableOpacity onPress={() => setShowFabricGuide(true)}>
              <Text style={styles.headerLink}>Lihat Panduan</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fabricGrid}>
            {product.fabrics.map((fab) => {
              const isSelected = selectedFabric.id === fab.id;
              return (
                <TouchableOpacity
                  key={fab.id}
                  style={[
                    styles.fabricOptionCard,
                    isSelected && styles.fabricOptionCardSelected,
                  ]}
                  onPress={() => setSelectedFabric(fab)}
                  activeOpacity={0.7}
                >
                  <View style={styles.fabricTitleRow}>
                    <Text
                      style={[
                        styles.fabricName,
                        isSelected && styles.fabricNameSelected,
                      ]}
                    >
                      {fab.name}
                    </Text>
                    {isSelected ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={COLORS.accentBlue}
                      />
                    ) : null}
                  </View>
                  <Text style={styles.fabricDesc}>{fab.description}</Text>
                  <Text style={styles.fabricPrice}>
                    {fab.priceModifier === 0
                      ? fab.badge || 'Standar Populer'
                      : `+Rp ${fab.priceModifier.toLocaleString('id-ID')}/pcs`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Pilihan Warna Utama Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="color-palette-outline" size={18} color={COLORS.accentBlue} />
              <Text style={styles.cardHeaderTitle}>Pilihan Warna Utama</Text>
            </View>
            <Text style={styles.selectedColorName}>{selectedColor.name}</Text>
          </View>

          <View style={styles.colorSwatchesRow}>
            {product.colors.map((col) => {
              const isSelected = selectedColor.id === col.id;
              return (
                <TouchableOpacity
                  key={col.id}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: col.hex },
                    col.hex === '#F8FAFC' && { borderWidth: 1, borderColor: '#CBD5E1' },
                    isSelected && styles.colorCircleSelected,
                  ]}
                  onPress={() => setSelectedColor(col)}
                  activeOpacity={0.8}
                >
                  {isSelected ? (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={col.hex === '#F8FAFC' ? COLORS.primaryNavy : COLORS.white}
                    />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Pilihan Ukuran Standar Card */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="body-outline" size={18} color={COLORS.accentBlue} />
              <Text style={styles.cardHeaderTitle}>Pilihan Ukuran Standar</Text>
            </View>
            <TouchableOpacity
              style={styles.sizeChartLink}
              onPress={() => setShowSizeChart(true)}
            >
              <Ionicons name="information-circle-outline" size={14} color={COLORS.accentBlue} />
              <Text style={styles.headerLink}>Size Chart</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sizesRow}>
            {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
              const isSelected = selectedSize === sz;
              return (
                <TouchableOpacity
                  key={sz}
                  style={[
                    styles.sizePill,
                    isSelected && styles.sizePillSelected,
                  ]}
                  onPress={() => setSelectedSize(sz)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.sizePillText,
                      isSelected && styles.sizePillTextSelected,
                    ]}
                  >
                    {sz}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Custom Size Option Button */}
          <TouchableOpacity
            style={styles.customSizeBtn}
            onPress={() => setShowCustomSizeModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="options-outline" size={16} color={COLORS.primaryNavy} />
            <Text style={styles.customSizeBtnText}>
              {customSizeText ? 'Ukuran Custom Aktif ✓' : 'Custom Size'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Minimal Pemesanan Card */}
        <View style={styles.minOrderCard}>
          <View style={styles.minOrderIcon}>
            <Ionicons name="cube-outline" size={20} color={COLORS.white} />
          </View>
          <View style={styles.minOrderTextWrapper}>
            <Text style={styles.minOrderTitle}>
              Minimal Pemesanan: {product.minPcs} Pcs
            </Text>
            <Text style={styles.minOrderDesc}>
              Bebas campur ukuran (S hingga XXL). Termasuk gratis mock-up visual digital 3D dan bordir logo dada kiri!
            </Text>
          </View>
        </View>

        {/* 3-Column Features Card */}
        <View style={styles.featuresRow}>
          <View style={styles.featureCol}>
            <Ionicons name="time-outline" size={20} color={COLORS.accentBlue} />
            <Text style={styles.featureTitle}>7–10 Hari</Text>
            <Text style={styles.featureSub}>Estimasi Jahit</Text>
          </View>
          <View style={styles.featureCol}>
            <Ionicons name="shield-outline" size={20} color={COLORS.accentBlue} />
            <Text style={styles.featureTitle}>QC Ketat</Text>
            <Text style={styles.featureSub}>Jahitan Kuat</Text>
          </View>
          <View style={styles.featureCol}>
            <Ionicons name="paper-plane-outline" size={20} color={COLORS.accentBlue} />
            <Text style={styles.featureTitle}>Kirim Cepat</Text>
            <Text style={styles.featureSub}>Seluruh Indo</Text>
          </View>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Sticky Bottom Purchase Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPriceLabel}>Estimasi Satuan</Text>
          <Text style={styles.bottomPriceValue}>
            Rp {unitPrice.toLocaleString('id-ID')}{' '}
            <Text style={styles.bottomPriceSub}>/pcs</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={styles.customOrderBtn}
          onPress={handleProceedToCustomOrder}
          activeOpacity={0.8}
        >
          <Text style={styles.customOrderBtnText}>Pesan Custom</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.primaryNavy} />
        </TouchableOpacity>
      </View>

      {/* Size Chart Modal */}
      <SizeChartModal
        visible={showSizeChart}
        onClose={() => setShowSizeChart(false)}
      />

      {/* Custom Size Modal */}
      <CustomSizeModal
        visible={showCustomSizeModal}
        onClose={() => setShowCustomSizeModal(false)}
        onSave={(text) => setCustomSizeText(text)}
      />

      {/* Fabric Guide Modal */}
      <FabricGuideModal
        visible={showFabricGuide}
        onClose={() => setShowFabricGuide(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  subActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  garansiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  garansiBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  actionIconsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  circleActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  imageCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 12,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  mainImageBox: {
    height: 220,
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  terlarisBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.88)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  terlarisText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  zoomBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  thumbImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  moreThumbsBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#EBF4F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreThumbsText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryNavy,
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
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.accentBlue,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primaryNavy,
    marginBottom: 8,
  },
  priceHighlight: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.accentBlue,
  },
  pricePerPcs: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  priceNote: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
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
    gap: 6,
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  headerLink: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accentBlue,
  },
  fabricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  fabricOptionCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  fabricOptionCardSelected: {
    backgroundColor: '#E0F2FE',
    borderColor: COLORS.accentBlue,
  },
  fabricTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  fabricName: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  fabricNameSelected: {
    color: '#0284C7',
  },
  fabricDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  fabricPrice: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accentBlue,
  },
  selectedColorName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  colorSwatchesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  colorCircleSelected: {
    borderWidth: 2.5,
    borderColor: COLORS.accentBlue,
  },
  sizeChartLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sizesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  sizePill: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizePillSelected: {
    backgroundColor: '#DBEAFE',
    borderWidth: 1.5,
    borderColor: COLORS.accentBlue,
  },
  sizePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  sizePillTextSelected: {
    color: COLORS.primaryNavy,
    fontWeight: '900',
  },
  customSizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  customSizeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  minOrderCard: {
    flexDirection: 'row',
    backgroundColor: '#006D94',
    borderRadius: 20,
    padding: 14,
    gap: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  minOrderIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  minOrderTextWrapper: {
    flex: 1,
  },
  minOrderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 3,
  },
  minOrderDesc: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.88)',
    lineHeight: 15,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  featureCol: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  featureTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginTop: 6,
  },
  featureSub: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEF6FB',
    ...SHADOWS.card,
  },
  bottomPriceLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  bottomPriceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primaryNavy,
  },
  bottomPriceSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  customOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  customOrderBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
});

