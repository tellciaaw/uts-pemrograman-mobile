import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useApp();
  const [emailOrPhone, setEmailOrPhone] = useState('evelynw@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');
    if (!emailOrPhone.trim()) {
      setErrorMsg('Email atau Nomor HP tidak boleh kosong.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);
    const result = await login(emailOrPhone, password);
    setIsLoading(false);

    if (result.success) {
      navigation.replace('MainTabs', { screen: 'HomeTab' });
    } else {
      setErrorMsg(result.message || 'Gagal masuk akun. Silakan coba lagi.');
    }
  };

  const handleSocialLogin = async (platform: string) => {
    setIsLoading(true);
    await login(`${platform.toLowerCase()}@konveksiku.id`, 'password123');
    setIsLoading(false);
    navigation.replace('MainTabs', { screen: 'HomeTab' });
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Kata Sandi',
      'Tautan pemulihan kata sandi telah dikirimkan ke WhatsApp/Email Anda.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Logo & Partner Badge */}
          <View style={styles.topLogoSection}>
            <View style={styles.logoScallopBadge}>
              <Image
                source={require('../../assets/images/logo_circle.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.partnerBadge}>
              <Text style={styles.partnerBadgeText}>
                CLOTHING & APPAREL PARTNER
              </Text>
            </View>
          </View>

          {/* Main White Login Card */}
          <View style={styles.cardContainer}>
            <Text style={styles.title}>Masuk ke Akun</Text>
            <Text style={styles.subtitle}>
              Masuk untuk kelola dan pantau pesanan konveksi Anda
            </Text>

            {errorMsg ? (
              <View style={styles.errorAlert}>
                <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
                <Text style={styles.errorAlertText}>{errorMsg}</Text>
              </View>
            ) : null}

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email atau Nomor HP</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="nama@email.com"
                  placeholderTextColor={COLORS.textMuted}
                  value={emailOrPhone}
                  onChangeText={(text) => {
                    setEmailOrPhone(text);
                    setErrorMsg('');
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kata Sandi</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrorMsg('');
                  }}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotText}>Lupa Kata Sandi?</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.submitBtnText}>Masuk</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>atau masuk dengan</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleSocialLogin('Google')}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-google" size={18} color="#EA4335" />
                <Text style={styles.socialBtnText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleSocialLogin('WhatsApp')}
                activeOpacity={0.7}
              >
                <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                <Text style={styles.socialBtnText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Real-time Order Production Notice */}
          <View style={styles.noticeBox}>
            <View style={styles.noticeIconWrapper}>
              <Ionicons name="flash-outline" size={18} color={COLORS.accentBlue} />
            </View>
            <Text style={styles.noticeText}>
              Konveksi kami sedang memproses <Text style={styles.boldText}>4.280 pcs</Text> pakaian minggu ini secara real-time.
            </Text>
          </View>

          {/* Registration Link */}
          <View style={styles.registerLinkRow}>
            <Text style={styles.normalText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLinkText}>Daftar</Text>
            </TouchableOpacity>
          </View>

          {/* Footer ISO Security */}
          <View style={styles.isoFooter}>
            <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.isoFooterText}>Aman & Terverifikasi ISO Konveksi</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    alignItems: 'center',
  },
  topLogoSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoScallopBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    ...SHADOWS.soft,
  },
  logoImage: {
    width: 52,
    height: 52,
  },
  partnerBadge: {
    backgroundColor: '#E0F2FE',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  partnerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.6,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 26,
    paddingHorizontal: 22,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.card,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
    gap: 6,
  },
  errorAlertText: {
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryNavy,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  eyeBtn: {
    padding: 6,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 18,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accentBlue,
  },
  submitBtn: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 11,
    color: COLORS.textMuted,
    paddingHorizontal: 10,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F7FB',
    borderRadius: 20,
    height: 44,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  socialBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4F9',
    borderRadius: 18,
    padding: 14,
    marginTop: 18,
    width: '100%',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E0EEF7',
  },
  noticeIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.primaryNavy,
    lineHeight: 17,
  },
  boldText: {
    fontWeight: '800',
  },
  registerLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  normalText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  registerLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accentBlue,
  },
  isoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  isoFooterText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});

