import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
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

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    setErrorMsg('');
    if (!name.trim()) {
      setErrorMsg('Nama lengkap wajib diisi.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Format email tidak valid.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Nomor WhatsApp / HP wajib diisi.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Kata sandi minimal 8 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMsg('Anda harus menyetujui Syarat & Ketentuan.');
      return;
    }

    setIsLoading(true);
    const result = await register(name, email, phone, password);
    setIsLoading(false);

    if (result.success) {
      Alert.alert(
        'Akun Berhasil Dibuat!',
        'Selamat datang di KONVEKSIKU. Anda siap memesan seragam impian Anda.',
        [
          {
            text: 'Mulai Sekarang',
            onPress: () => navigation.replace('MainTabs', { screen: 'HomeTab' }),
          },
        ]
      );
    } else {
      setErrorMsg(result.message || 'Gagal mendaftar.');
    }
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
          {/* Top Bar with back button and step badge */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={20} color={COLORS.primaryNavy} />
            </TouchableOpacity>

            <View style={styles.stepBadge}>
              <View style={styles.stepDot} />
              <Text style={styles.stepBadgeText}>Langkah 1 dari 1</Text>
            </View>
          </View>

          {/* Subheader Title */}
          <View style={styles.headerSection}>
            <View style={styles.partnerBadge}>
              <Ionicons name="shirt-outline" size={13} color={COLORS.accentBlue} />
              <Text style={styles.partnerBadgeText}>Konveksiku Partner</Text>
            </View>
            <Text style={styles.title}>Buat Akun Baru</Text>
            <Text style={styles.subtitle}>
              Daftar sekarang untuk mulai memesan pakaian custom berkualitas dan pantau jahit secara real-time.
            </Text>
          </View>

          {/* Registration Card */}
          <View style={styles.cardContainer}>
            {/* Guarantee Inner Banner */}
            <View style={styles.guaranteeBanner}>
              <View style={styles.guaranteeIconCircle}>
                <Ionicons name="shield-checkmark" size={18} color={COLORS.white} />
              </View>
              <View style={styles.guaranteeTextWrapper}>
                <Text style={styles.guaranteeTitle}>Garansi Kerapian Jahitan</Text>
                <Text style={styles.guaranteeSub}>
                  Kustomisasi bordir, sablon, & seragam aman
                </Text>
              </View>
            </View>

            {errorMsg ? (
              <View style={styles.errorAlert}>
                <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
                <Text style={styles.errorAlertText}>{errorMsg}</Text>
              </View>
            ) : null}

            {/* Nama Lengkap */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nama Lengkap</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Evelyn Wijaya"
                  placeholderTextColor={COLORS.textMuted}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setErrorMsg('');
                  }}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="evelynw@gmail.com"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setErrorMsg('');
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Nomor WhatsApp */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nomor WhatsApp / HP</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="call-outline"
                  size={18}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="0812-3456-7890"
                  placeholderTextColor={COLORS.textMuted}
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    setErrorMsg('');
                  }}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Kata Sandi */}
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
                  placeholder="Minimal 8 karakter"
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

            {/* Konfirmasi Kata Sandi */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Konfirmasi Kata Sandi</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={18}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Ulangi kata sandi"
                  placeholderTextColor={COLORS.textMuted}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setErrorMsg('');
                  }}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms Checkbox */}
            <TouchableOpacity
              style={styles.checkboxRow}
              activeOpacity={0.8}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              <View
                style={[
                  styles.checkboxBox,
                  agreedToTerms && styles.checkboxBoxChecked,
                ]}
              >
                {agreedToTerms ? (
                  <Ionicons name="checkmark" size={14} color={COLORS.white} />
                ) : null}
              </View>
              <Text style={styles.checkboxLabel}>
                Saya menyetujui <Text style={styles.linkText}>Syarat & Ketentuan</Text> serta perlindungan data produksi seragam Konveksiku.
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <View style={styles.btnRow}>
                  <Text style={styles.submitBtnText}>Daftar Sekarang</Text>
                  <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Already have account */}
          <View style={styles.loginLinkRow}>
            <Text style={styles.normalText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLinkText}>Masuk</Text>
            </TouchableOpacity>
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
    paddingTop: 10,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accentBlue,
    marginRight: 6,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  headerSection: {
    marginBottom: 18,
  },
  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D7EBF8',
    borderRadius: 12,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
    marginBottom: 8,
  },
  partnerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryNavy,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primaryNavy,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 26,
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.card,
  },
  guaranteeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4F9',
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  guaranteeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.accentBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guaranteeTextWrapper: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryNavy,
  },
  guaranteeSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
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
    marginBottom: 12,
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
    height: 46,
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
    marginBottom: 18,
    gap: 10,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.textMuted,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxBoxChecked: {
    backgroundColor: COLORS.accentBlue,
    borderColor: COLORS.accentBlue,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  linkText: {
    fontWeight: '700',
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
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  loginLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  normalText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  loginLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accentBlue,
  },
});

