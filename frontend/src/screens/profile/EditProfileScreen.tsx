import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
  Shadow,
} from '../../utils/theme';
import { currentUser } from '../../utils/mockData';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Avatar from '../../components/Avatar';

export default function EditProfileScreen({ navigation }: any) {
  const [name, setName] = useState(currentUser.name);
  const [location, setLocation] = useState(currentUser.location);
  const [selectedRole, setSelectedRole] = useState(currentUser.role);

  const handleSave = () => {
    Alert.alert('Profile Updated', 'Your profile has been saved.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity>
            <Avatar name={name} size={90} />
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </View>

        <Input label="Full Name" value={name} onChangeText={setName} />

        <Input
          label="Phone Number"
          value={currentUser.phone}
          editable={false}
          containerStyle={{ opacity: 0.6 }}
        />

        <Input
          label="Location"
          value={location}
          onChangeText={setLocation}
          leftIcon={<Ionicons name="location-outline" size={18} color={Colors.textSecondary} />}
        />

        {/* Role Selection */}
        <Text style={styles.label}>Preferred Role</Text>
        <View style={styles.roleRow}>
          {(['creator', 'doer', 'both'] as const).map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleChip,
                selectedRole === role && styles.roleChipSelected,
              ]}
              onPress={() => setSelectedRole(role)}
            >
              <Text
                style={[
                  styles.roleChipText,
                  selectedRole === role && styles.roleChipTextSelected,
                ]}
              >
                {role === 'both' ? 'Both' : role === 'creator' ? 'Creator' : 'Doer'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title="Save Changes"
          onPress={handleSave}
          size="lg"
          style={{ marginTop: Spacing.xxxl }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    ...Shadow.sm,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  content: {
    padding: Spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
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
  changePhotoText: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
    marginTop: Spacing.sm,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  roleRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  roleChip: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  roleChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  roleChipText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  roleChipTextSelected: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
});
