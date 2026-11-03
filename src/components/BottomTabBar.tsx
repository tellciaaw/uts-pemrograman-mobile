import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.outerContainer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          let label = 'Beranda';

          if (route.name === 'HomeTab') {
            iconName = isFocused ? 'home' : 'home-outline';
            label = 'Beranda';
          } else if (route.name === 'CatalogTab') {
            iconName = isFocused ? 'grid' : 'grid-outline';
            label = 'Katalog';
          } else if (route.name === 'OrdersTab') {
            iconName = isFocused ? 'cube' : 'cube-outline';
            label = 'Pesanan';
          } else if (route.name === 'ProfileTab') {
            iconName = isFocused ? 'person' : 'person-outline';
            label = 'Profil';
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={[styles.tabButton, isFocused && styles.tabButtonActive]}
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconName}
                size={18}
                color={isFocused ? COLORS.primaryNavy : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    pointerEvents: 'box-none',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 36,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#10284D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#EEF6FB',
    width: '90%',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 24,
  },
  tabButtonActive: {
    backgroundColor: COLORS.activeTabBg,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: COLORS.activeTabText,
    fontWeight: '700',
  },
  tabLabelInactive: {
    color: COLORS.textSecondary,
  },
});

