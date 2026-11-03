import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, Order } from '../types';
import { INITIAL_USER, INITIAL_ORDERS } from '../data/mockData';

const KEYS = {
  USER_PROFILE: '@konveksiku_user_profile',
  IS_LOGGED_IN: '@konveksiku_is_logged_in',
  ORDERS: '@konveksiku_orders',
  FAVORITES: '@konveksiku_favorites',
  NOTIFICATIONS: '@konveksiku_notifications',
};

export const StorageService = {
  async getUserProfile(): Promise<UserProfile> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : INITIAL_USER;
    } catch (error) {
      console.warn('Error reading user profile from storage', error);
      return INITIAL_USER;
    }
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.warn('Error saving user profile to storage', error);
    }
  },

  async getIsLoggedIn(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(KEYS.IS_LOGGED_IN);
      return data !== null ? JSON.parse(data) : true; // Default to true or false for demo
    } catch {
      return true;
    }
  },

  async setIsLoggedIn(isLoggedIn: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.IS_LOGGED_IN, JSON.stringify(isLoggedIn));
    } catch (error) {
      console.warn('Error setting login status', error);
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.ORDERS);
      return data ? JSON.parse(data) : INITIAL_ORDERS;
    } catch (error) {
      console.warn('Error getting orders', error);
      return INITIAL_ORDERS;
    }
  },

  async saveOrders(orders: Order[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    } catch (error) {
      console.warn('Error saving orders', error);
    }
  },

  async addOrder(newOrder: Order): Promise<Order[]> {
    try {
      const existing = await this.getOrders();
      const updated = [newOrder, ...existing];
      await this.saveOrders(updated);
      return updated;
    } catch (error) {
      console.warn('Error adding order', error);
      return [newOrder];
    }
  },

  async getFavorites(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.FAVORITES);
      return data ? JSON.parse(data) : ['prod-1', 'prod-2'];
    } catch {
      return ['prod-1', 'prod-2'];
    }
  },

  async toggleFavorite(productId: string): Promise<string[]> {
    try {
      const favorites = await this.getFavorites();
      const exists = favorites.includes(productId);
      const updated = exists
        ? favorites.filter((id) => id !== productId)
        : [...favorites, productId];
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },
};

