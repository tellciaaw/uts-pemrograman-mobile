import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../types';
import { BottomTabBar } from '../components/BottomTabBar';

// Screens
import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { CatalogScreen } from '../screens/CatalogScreen';
import { MyOrdersScreen } from '../screens/MyOrdersScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { CustomOrderScreen } from '../screens/CustomOrderScreen';
import { OrderSummaryScreen } from '../screens/OrderSummaryScreen';
import { OrderConfirmationScreen } from '../screens/OrderConfirmationScreen';
import { OrderTrackingScreen } from '../screens/OrderTrackingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabsNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="CatalogTab" component={CatalogScreen} />
      <Tab.Screen name="OrdersTab" component={MyOrdersScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="CustomOrder" component={CustomOrderScreen} />
      <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    </Stack.Navigator>
  );
};

