import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../utils/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSendOTP = async () => {
    if (phone.length < 10) {
      setError('Enter a valid 10-digit phone number');
      return;
    }
    setError('');
    await login(phone);
    navigation.navigate('OTP', { phone });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        {/* Logo / Branding */}
        <View style={styles.branding}>
          <View style={styles.logoCircle}>
            <Ionicons name="checkmark-done" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.appName}>Taskmate</Text>
          <Text style={styles.tagline}>Get tasks done. Earn money.</Text>
        </View>

        {/* Phone Input */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Log in or Sign up</Text>
          <Text style={styles.formSubtitle}>
            Enter your phone number to continue
          </Text>

          <Input
            placeholder="Phone number"
            value={phone}
            onChangeText={(text) => {
              setPhone(text.replace(/[^0-9]/g, ''));
              setError('');
            }}
            keyboardType="phone-pad"
            maxLength={10}
            error={error}
            leftIcon={
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
              </View>
            }
          />

          <Button
            title="Send OTP"
            onPress={handleSendOTP}
            loading={isLoading}
            disabled={phone.length < 10}
            size="lg"
          />
        </View>

        {/* Terms */}
        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={styles.link}>Terms of Service</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  branding: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl + 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  appName: {
    fontSize: FontSize.hero,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  tagline: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  form: {
    marginBottom: Spacing.xxl,
  },
  formTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  formSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  countryCode: {
    paddingRight: Spacing.sm,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    marginRight: Spacing.xs,
  },
  countryCodeText: {
    fontSize: FontSize.lg,
    color: Colors.text,
    fontWeight: FontWeight.medium,
  },
  terms: {
    textAlign: 'center',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  link: {
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
});
