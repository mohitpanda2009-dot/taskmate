import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
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
import { formatCurrency } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../../components/Avatar';
import RatingStars from '../../components/RatingStars';

const MENU_ITEMS = [
  { id: 'edit', icon: 'person-outline', label: 'Edit Profile', screen: 'EditProfile' },
  { id: 'wallet', icon: 'wallet-outline', label: 'Wallet', screen: 'Wallet' },
  { id: 'history', icon: 'time-outline', label: 'Task History', screen: 'TaskHistory' },
  { id: 'settings', icon: 'settings-outline', label: 'Settings', screen: null },
  { id: 'help', icon: 'help-circle-outline', label: 'Help & Support', screen: null },
  { id: 'about', icon: 'information-circle-outline', label: 'About Taskmate', screen: null },
];

export default function ProfileScreen({ navigation }: any) {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Avatar name={currentUser.name} size={80} />
        <Text style={styles.name}>{currentUser.name}</Text>
        <Text style={styles.phone}>{currentUser.phone}</Text>
        <View style={styles.ratingRow}>
          <RatingStars rating={currentUser.rating} size={16} count={currentUser.reviewCount} />
        </View>
        {currentUser.verified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={14} color={Colors.success} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
        <Text style={styles.memberSince}>
          Member since {currentUser.memberSince}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentUser.tasksCreated}</Text>
          <Text style={styles.statLabel}>Created</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentUser.tasksCompleted}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: Colors.secondary }]}>
            {formatCurrency(currentUser.earnings)}
          </Text>
          <Text style={styles.statLabel}>Earned</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuCard}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
            ]}
            onPress={() => {
              if (item.screen) navigation.navigate(item.screen);
            }}
            activeOpacity={0.6}
          >
            <Ionicons name={item.icon as any} size={22} color={Colors.textSecondary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color={Colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Taskmate v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    ...Shadow.sm,
  },
  name: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  phone: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    marginTop: Spacing.sm,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
    backgroundColor: Colors.success + '12',
    paddingVertical: 3,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  verifiedText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.success,
  },
  memberSince: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    marginTop: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    ...Shadow.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  menuCard: {
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadow.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuLabel: {
    flex: 1,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.error + '08',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.error + '20',
  },
  logoutText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.error,
  },
  version: {
    textAlign: 'center',
    fontSize: FontSize.sm,
    color: Colors.textLight,
    marginTop: Spacing.xl,
  },
});
