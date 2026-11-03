import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  onAvatarPress?: () => void;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  rightComponent,
  onAvatarPress,
  subtitle = 'KONVEKSIKU',
}) => {
  const { user } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color={COLORS.primaryNavy} />
          </TouchableOpacity>
        ) : (
          <View style={styles.logoBadge}>
            <Image
              source={require('../../assets/images/logo_circle.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        )}

        <View style={styles.titleWrapper}>
          {showBack ? (
            <View style={styles.titleRow}>
              <View style={styles.miniLogo}>
                <Image
                  source={require('../../assets/images/logo_circle.png')}
                  style={styles.miniLogoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.headerTitle}>{title}</Text>
            </View>
          ) : (
            <>
              <Text style={styles.appSubtitle}>{subtitle}</Text>
              <Text style={styles.appTitle}>{title}</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.rightContainer}>
        {rightComponent ? (
          rightComponent
        ) : (
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={onAvatarPress}
            activeOpacity={0.8}
          >
            <Image
              source={
                user.avatarUri
                  ? { uri: user.avatarUri }
                  : require('../../assets/images/user_avatar.png')
              }
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.paddingLg,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  logoImage: {
    width: 32,
    height: 32,
  },
  miniLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    overflow: 'hidden',
  },
  miniLogoImage: {
    width: 22,
    height: 22,
  },
  titleWrapper: {
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accentBlue,
    letterSpacing: 0.8,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginTop: -1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.pillBlue,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
});

