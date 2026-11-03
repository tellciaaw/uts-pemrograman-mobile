export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUri?: string;
  isVerified: boolean;
  address: string;
  completedOrdersCount: number;
  activeOrdersCount: number;
  notificationsEnabled: boolean;
}

export interface FabricOption {
  id: string;
  name: string;
  description: string;
  priceModifier: number; // additional price per pcs
  badge?: string;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Kemeja' | 'Kaos & Polo' | 'Jaket & Rompi' | 'Celana';
  categorySub: string;
  fabricSummary: string;
  description: string;
  basePrice: number;
  rating: number;
  reviewsCount: number;
  minPcs: number;
  image: any;
  detailImage?: any;
  isPopular?: boolean;
  isBestSeller?: boolean;
  fabrics: FabricOption[];
  colors: ColorOption[];
}

export interface SizeBreakdown {
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
}

export interface CustomOrderDraft {
  productId: string;
  productName: string;
  productCategory: string;
  productImage: any;
  fabric: FabricOption;
  color: ColorOption;
  quantity: number;
  sizeBreakdown: SizeBreakdown;
  designFileUri?: string;
  designFileName?: string;
  designFileSize?: string;
  notes: string;
  embroideryDetails: string;
  basePricePerPcs: number;
}

export interface TrackingStage {
  stageNumber: number;
  title: string;
  description: string;
  timestamp?: string;
  isCompleted: boolean;
  isInProgress: boolean;
  badge?: string;
  photos?: any[];
}

export interface Order {
  id: string; // e.g. #KNV-2025-0842
  createdAt: string; // e.g. 18 Mei 2025
  productId: string;
  productName: string;
  productCategory: string;
  productImage: any;
  fabricName: string;
  colorName: string;
  colorHex: string;
  quantity: number;
  sizeBreakdown: SizeBreakdown;
  designFileName?: string;
  designFileUri?: string;
  notes: string;
  shippingAddress: string;
  recipientName: string;
  recipientPhone: string;
  basePriceTotal: number;
  embroideryFee: number;
  discountPromo: number;
  shippingCost: number;
  totalPrice: number;
  status: 'Menunggu Verifikasi Desain' | 'Sedang Diproduksi' | 'Pemeriksaan QC' | 'Siap Dikirim' | 'Selesai' | 'Dibatalkan';
  statusCategory: 'diproses' | 'selesai' | 'dibatalkan';
  currentStageNumber: number; // 1 to 6
  estimatedCompletion: string;
  tailorDurationDays: string;
  currentStageTitle: string;
  trackingStages: TrackingStage[];
}

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: { screen?: keyof MainTabParamList };
  ProductDetail: { productId: string };
  CustomOrder: { productId: string };
  OrderSummary: { orderDraft: CustomOrderDraft };
  OrderConfirmation: { orderId: string };
  OrderTracking: { orderId: string };
};

export type MainTabParamList = {
  HomeTab: undefined;
  CatalogTab: { category?: string } | undefined;
  OrdersTab: { filter?: 'semua' | 'diproses' | 'selesai' | 'dibatalkan' } | undefined;
  ProfileTab: undefined;
};

