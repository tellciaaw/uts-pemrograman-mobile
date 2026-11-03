import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Order, CustomOrderDraft, TrackingStage } from '../types';
import { StorageService } from '../services/storage';
import { INITIAL_USER, INITIAL_ORDERS } from '../data/mockData';

interface AppContextType {
  user: UserProfile;
  orders: Order[];
  favorites: string[];
  isLoggedIn: boolean;
  customOrderDraft: CustomOrderDraft | null;
  setCustomOrderDraft: (draft: CustomOrderDraft | null) => void;
  login: (emailOrPhone: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, phone: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  createOrder: (draft: CustomOrderDraft) => Promise<string>;
  getOrderById: (orderId: string) => Order | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [favorites, setFavorites] = useState<string[]>(['prod-1', 'prod-2']);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [customOrderDraft, setCustomOrderDraft] = useState<CustomOrderDraft | null>(null);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    const storedUser = await StorageService.getUserProfile();
    const storedOrders = await StorageService.getOrders();
    const storedFavs = await StorageService.getFavorites();
    const storedLogin = await StorageService.getIsLoggedIn();

    setUser(storedUser);
    setOrders(storedOrders);
    setFavorites(storedFavs);
    setIsLoggedIn(storedLogin);
  };

  const login = async (emailOrPhone: string, pass: string) => {
    if (!emailOrPhone.trim()) {
      return { success: false, message: 'Email atau nomor HP wajib diisi.' };
    }
    if (!pass.trim() || pass.length < 6) {
      return { success: false, message: 'Kata sandi minimal 6 karakter.' };
    }

    const updatedUser = {
      ...user,
      email: emailOrPhone.includes('@') ? emailOrPhone : user.email,
      phone: !emailOrPhone.includes('@') ? emailOrPhone : user.phone,
    };

    setUser(updatedUser);
    setIsLoggedIn(true);
    await StorageService.saveUserProfile(updatedUser);
    await StorageService.setIsLoggedIn(true);
    return { success: true };
  };

  const register = async (name: string, email: string, phone: string, pass: string) => {
    if (!name.trim()) return { success: false, message: 'Nama lengkap wajib diisi.' };
    if (!email.trim() || !email.includes('@')) return { success: false, message: 'Format email tidak valid.' };
    if (!phone.trim()) return { success: false, message: 'Nomor WhatsApp wajib diisi.' };
    if (!pass.trim() || pass.length < 6) return { success: false, message: 'Kata sandi minimal 6 karakter.' };

    const newUser: UserProfile = {
      ...user,
      name,
      email,
      phone,
      isVerified: true,
    };

    setUser(newUser);
    setIsLoggedIn(true);
    await StorageService.saveUserProfile(newUser);
    await StorageService.setIsLoggedIn(true);
    return { success: true };
  };

  const logout = async () => {
    setIsLoggedIn(false);
    await StorageService.setIsLoggedIn(false);
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    const newUser = { ...user, ...updated };
    setUser(newUser);
    await StorageService.saveUserProfile(newUser);
  };

  const toggleFavorite = async (productId: string) => {
    const updated = await StorageService.toggleFavorite(productId);
    setFavorites(updated);
  };

  const createOrder = async (draft: CustomOrderDraft): Promise<string> => {
    // Generate unique order ID in format #KNV-2025-XXXX
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderId = `#KNV-2025-${randomDigits}`;
    const today = new Date();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    const dateFormatted = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    const basePriceTotal = draft.basePricePerPcs * draft.quantity;
    const embroideryFee = 10000 * draft.quantity; // Rp 10.000 / pcs for embroidery
    const discountPromo = Math.round(basePriceTotal * 0.15); // 15% discount promo
    const shippingCost = 65000;
    const totalPrice = basePriceTotal + embroideryFee - discountPromo + shippingCost;

    const initialStages: TrackingStage[] = [
      {
        stageNumber: 1,
        title: 'Pesanan Diterima',
        timestamp: `${today.getDate()} ${months[today.getMonth()]}, ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`,
        description: 'Pembayaran DP 50% berhasil diverifikasi sistem kasir.',
        isCompleted: true,
        isInProgress: false,
      },
      {
        stageNumber: 2,
        title: 'Pesanan Dikonfirmasi & Proofing',
        timestamp: 'Sedang Berjalan',
        badge: 'Tahap Verifikasi',
        description: 'Verifikasi artwork logo, kesesuaian pola ukuran, dan persetujuan sample proofing.',
        isCompleted: false,
        isInProgress: true,
      },
      {
        stageNumber: 3,
        title: 'Sedang Diproduksi (Potong & Jahit)',
        timestamp: 'Est. 3 Hari Kedepan',
        description: 'Pemotongan bahan sesuai ukuran dan proses penjahitan komponen garmen.',
        isCompleted: false,
        isInProgress: false,
        photos: [
          require('../../assets/images/thumb_fabric.png'),
          require('../../assets/images/thumb_patch.png'),
        ],
      },
      {
        stageNumber: 4,
        title: 'Pemeriksaan Kualitas (QC)',
        timestamp: 'Est. 6 Hari Kedepan',
        description: 'Pengecekan presisi jahitan, tarikan kancing, dan kerapian sisa benang.',
        isCompleted: false,
        isInProgress: false,
      },
      {
        stageNumber: 5,
        title: 'Siap Dikirim (Packing)',
        timestamp: 'Est. 7 Hari Kedepan',
        description: 'Steam uap bertekanan tinggi, pelipatan standar garmen, dan polybag per pcs.',
        isCompleted: false,
        isInProgress: false,
      },
      {
        stageNumber: 6,
        title: 'Pesanan Selesai / Terkirim',
        timestamp: 'Est. 8 Hari Kedepan',
        description: 'Penyerahan ke kurir kargo ekspedisi menuju alamat pemesan.',
        isCompleted: false,
        isInProgress: false,
      },
    ];

    const newOrder: Order = {
      id: orderId,
      createdAt: dateFormatted,
      productId: draft.productId,
      productName: draft.productName,
      productCategory: draft.productCategory,
      productImage: draft.productImage,
      fabricName: draft.fabric.name,
      colorName: draft.color.name,
      colorHex: draft.color.hex,
      quantity: draft.quantity,
      sizeBreakdown: draft.sizeBreakdown,
      designFileName: draft.designFileName || 'Logo_Custom_Client.png',
      designFileUri: draft.designFileUri,
      notes: draft.notes || 'Bordir komputer dada kiri, jahitan ganda rapi.',
      shippingAddress: user.address,
      recipientName: user.name,
      recipientPhone: user.phone,
      basePriceTotal,
      embroideryFee,
      discountPromo,
      shippingCost,
      totalPrice,
      status: 'Menunggu Verifikasi Desain',
      statusCategory: 'diproses',
      currentStageNumber: 2,
      estimatedCompletion: '7 - 10 Hari Kerja',
      tailorDurationDays: 'Tahap 1 dari 6',
      currentStageTitle: 'Menunggu Verifikasi Desain',
      trackingStages: initialStages,
    };

    const updatedOrders = await StorageService.addOrder(newOrder);
    setOrders(updatedOrders);

    // Update active orders count in user profile
    await updateProfile({
      activeOrdersCount: (user.activeOrdersCount || 0) + 1,
    });

    return orderId;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((o) => o.id === orderId);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        orders,
        favorites,
        isLoggedIn,
        customOrderDraft,
        setCustomOrderDraft,
        login,
        register,
        logout,
        updateProfile,
        toggleFavorite,
        createOrder,
        getOrderById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

