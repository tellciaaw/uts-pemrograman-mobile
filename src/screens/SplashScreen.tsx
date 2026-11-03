import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const { width } = Dimensions.get('window');

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { isLoggedIn } = useApp();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto navigate after 2.5s
    const timer = setTimeout(() => {
      proceedNext();
    }, 2500);

    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  const proceedNext = () => {
    if (isLoggedIn) {
      navigation.replace('MainTabs', { screen: 'HomeTab' });
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={proceedNext}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Top Tag Pill */}
        <View style={styles.topBadge}>
          <View style={styles.dotTeal} />
          <Text style={styles.topBadgeText}>APPAREL STUDIO</Text>
        </View>

        {/* Center Logo Section with concentric rings */}
        <View style={styles.logoCenterContainer}>
          <View style={styles.outerGlowRing}>
            <View style={styles.middleDashedRing}>
              <Animated.View
                style={[
                  styles.logoCard,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <Image
                  source={require('../../assets/images/logo_circle.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </Animated.View>
            </View>
          </View>

          {/* Title & Tagline */}
          <Text style={styles.brandTitle}>KONVEKSIKU</Text>
          <Text style={styles.brandTagline}>Custom Clothing. Made for You.</Text>

          {/* Guarantee Pill */}
          <View style={styles.guaranteeBadge}>
            <Ionicons name="shield-checkmark" size={15} color={COLORS.accentBlue} />
            <Text style={styles.guaranteeText}>
              Garansi Mutu & Transparansi Jahit
            </Text>
          </View>
        </View>

        {/* Bottom Loading Dots & Version */}
        <View style={styles.bottomSection}>
          <View style={styles.loadingDotsRow}>
            <View style={[styles.loadingDot, styles.dotActive]} />
            <View style={[styles.loadingDot, styles.dotActive]} />
            <View style={[styles.loadingDot, styles.dotInactive]} />
          </View>

          <Text style={styles.versionText}>
            v1.0.0  •  Presisi & Kualitas
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 20,
    ...SHADOWS.soft,
  },
  dotTeal: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accentBlue,
    marginRight: 6,
  },
  topBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryNavy,
    letterSpacing: 0.8,
  },
  logoCenterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerGlowRing: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.accentBlue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 28,
  },
  middleDashedRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCard: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 125,
    height: 125,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primaryNavy,
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 6,
    fontWeight: '500',
  },
  guaranteeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
    ...SHADOWS.soft,
  },
  guaranteeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryNavy,
  },
  bottomSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  loadingDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: COLORS.accentBlue,
  },
  dotInactive: {
    backgroundColor: '#93C5FD',
  },
  versionText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});

