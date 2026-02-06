import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../utils/theme';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

const OTP_LENGTH = 6;

export default function OTPScreen({ navigation, route }: any) {
  const phone = route?.params?.phone || '9876543210';
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const { verifyOTP, isLoading } = useAuth();
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    setError('');

    if (text && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError('Enter the complete OTP');
      return;
    }
    const success = await verifyOTP(code);
    if (success) {
      navigation.navigate('Onboarding');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleResend = () => {
    setTimer(30);
    setOtp(Array(OTP_LENGTH).fill(''));
    setError('');
    inputs.current[0]?.focus();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <Text style={styles.title}>Verify your number</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{' '}
          <Text style={styles.phone}>+91 {phone}</Text>
        </Text>

        {/* OTP Boxes */}
        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={[
                styles.otpBox,
                digit ? styles.otpBoxFilled : null,
                error ? styles.otpBoxError : null,
              ]}
              value={digit}
              onChangeText={(text) => handleChange(text.slice(-1), index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              autoFocus={index === 0}
            />
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          title="Verify OTP"
          onPress={handleVerify}
          loading={isLoading}
          size="lg"
          style={{ marginTop: Spacing.xxl }}
        />

        {/* Resend */}
        <View style={styles.resendRow}>
          {timer > 0 ? (
            <Text style={styles.timerText}>
              Resend OTP in <Text style={styles.timerBold}>{timer}s</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendButton}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>
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
    paddingHorizontal: Spacing.xxl,
    paddingTop: 60,
  },
  backButton: {
    padding: Spacing.xs,
    marginBottom: Spacing.xxl,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.xxxl,
  },
  phone: {
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    textAlign: 'center',
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    backgroundColor: Colors.card,
  },
  otpBoxFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  otpBoxError: {
    borderColor: Colors.error,
  },
  error: {
    color: Colors.error,
    fontSize: FontSize.sm,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  resendRow: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  timerText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  timerBold: {
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  resendButton: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
});
