import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../utils/theme';
import { getStatusColor, getStatusLabel } from '../utils/helpers';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const color = getStatusColor(status);

  return (
    <View
      style={[
        styles.badge,
        size === 'md' && styles.badgeMd,
        { backgroundColor: color + '18', borderColor: color + '40' },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, size === 'md' && styles.textMd, { color }]}>
        {getStatusLabel(status)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: 4,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingVertical: 5,
    paddingHorizontal: Spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  textMd: {
    fontSize: FontSize.sm,
  },
});
