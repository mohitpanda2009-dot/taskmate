import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../utils/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Avatar from '../../components/Avatar';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const WELCOME_SLIDES = [
  {
    icon: 'flash-outline',
    title: 'Get things done',
    subtitle: 'Post any micro-task and find someone nearby to do it for you.',
  },
  {
    icon: 'wallet-outline',
    title: 'Earn on the go',
    subtitle: 'Pick up tasks near you and earn money completing them.',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Safe & Trusted',
    subtitle: 'Verified users, secure payments, and rating system you can trust.',
  },
];

const ROLES = [
  {
    id: 'creator',
    icon: 'create-outline',
    label: 'Task Creator',
    desc: 'I need tasks done',
  },
  {
    id: 'doer',
    icon: 'hammer-outline',
    label: 'Task Doer',
    desc: 'I want to earn money',
  },
  {
    id: 'both',
    icon: 'swap-horizontal-outline',
    label: 'Both',
    desc: 'I do both!',
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const [step, setStep] = useState(0); // 0-2: welcome, 3: role, 4: name, 5: location
  const [selectedRole, setSelectedRole] = useState('');
  const [name, setName] = useState('');
  const { completeOnboarding } = useAuth();

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleComplete = () => {
    completeOnboarding({ name: name || 'User', role: selectedRole || 'both' });
    // Navigation handled by auth state change
  };

  const handleLocationPermission = () => {
    Alert.alert(
      'Location Permission',
      'Taskmate needs location access to show nearby tasks.',
      [
        { text: 'Not Now', onPress: handleComplete },
        { text: 'Allow', onPress: handleComplete },
      ]
    );
  };

  // Welcome slides (steps 0-2)
  if (step <= 2) {
    const slide = WELCOME_SLIDES[step];
    return (
      <View style={styles.container}>
        <View style={styles.slideContent}>
          <View style={styles.iconBig}>
            <Ionicons name={slide.icon as any} size={64} color={Colors.primary} />
          </View>
          <Text style={styles.slideTitle}>{slide.title}</Text>
          <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
        </View>

        {/* Dots */}
        <View style={styles.dotsRow}>
          {WELCOME_SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>

        <View style={styles.bottomActions}>
          {step < 2 ? (
            <>
              <TouchableOpacity onPress={() => setStep(3)} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              <Button title="Next" onPress={handleNext} style={{ flex: 1 }} />
            </>
          ) : (
            <Button title="Get Started" onPress={handleNext} size="lg" />
          )}
        </View>
      </View>
    );
  }

  // Role selection (step 3)
  if (step === 3) {
    return (
      <View style={styles.container}>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>What do you want to do?</Text>
          <Text style={styles.stepSubtitle}>You can always change this later</Text>

          <View style={styles.roleGrid}>
            {ROLES.map((role) => (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.roleCard,
                  selectedRole === role.id && styles.roleCardSelected,
                ]}
                onPress={() => setSelectedRole(role.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={role.icon as any}
                  size={32}
                  color={selectedRole === role.id ? Colors.primary : Colors.textSecondary}
                />
                <Text
                  style={[
                    styles.roleLabel,
                    selectedRole === role.id && styles.roleLabelSelected,
                  ]}
                >
                  {role.label}
                </Text>
                <Text style={styles.roleDesc}>{role.desc}</Text>
                {selectedRole === role.id && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={Colors.primary}
                    style={styles.roleCheck}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomButton}>
          <Button
            title="Continue"
            onPress={handleNext}
            disabled={!selectedRole}
            size="lg"
          />
        </View>
      </View>
    );
  }

  // Name & Avatar (step 4)
  if (step === 4) {
    return (
      <View style={styles.container}>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>What's your name?</Text>
          <Text style={styles.stepSubtitle}>This is how others will see you</Text>

          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarPicker}>
              <Avatar name={name || 'U'} size={90} />
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>

          <Input
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            autoFocus
          />
        </View>

        <View style={styles.bottomButton}>
          <Button
            title="Continue"
            onPress={handleNext}
            disabled={name.length < 2}
            size="lg"
          />
        </View>
      </View>
    );
  }

  // Location permission (step 5)
  return (
    <View style={styles.container}>
      <View style={styles.slideContent}>
        <View style={[styles.iconBig, { backgroundColor: Colors.success + '15' }]}>
          <Ionicons name="location" size={64} color={Colors.success} />
        </View>
        <Text style={styles.slideTitle}>Enable Location</Text>
        <Text style={styles.slideSubtitle}>
          We need your location to show tasks near you and help you find work in your area.
        </Text>
      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity onPress={handleComplete} style={styles.skipButton}>
          <Text style={styles.skipText}>Not Now</Text>
        </TouchableOpacity>
        <Button
          title="Enable Location"
          onPress={handleLocationPermission}
          style={{ flex: 1 }}
          icon={<Ionicons name="location" size={18} color="#FFFFFF" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xxl,
    paddingTop: 80,
    paddingBottom: 40,
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBig: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxxl,
  },
  slideTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  slideSubtitle: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: Spacing.lg,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  skipButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  skipText: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  bottomButton: {
    paddingTop: Spacing.xl,
  },
  stepContent: {
    flex: 1,
    paddingTop: Spacing.xxl,
  },
  stepTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  stepSubtitle: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxxl,
  },
  roleGrid: {
    gap: Spacing.md,
  },
  roleCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    ...Shadow.sm,
  },
  roleCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '06',
  },
  roleLabel: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  roleLabelSelected: {
    color: Colors.primary,
  },
  roleDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  roleCheck: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  avatarPicker: {
    position: 'relative',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.card,
  },
});
