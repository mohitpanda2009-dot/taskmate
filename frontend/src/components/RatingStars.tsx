import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing } from '../utils/theme';

interface RatingStarsProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  count?: number;
}

export default function RatingStars({
  rating,
  size = 14,
  showValue = true,
  count,
}: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <View style={styles.container}>
      {[...Array(fullStars)].map((_, i) => (
        <Ionicons key={`full-${i}`} name="star" size={size} color={Colors.secondary} />
      ))}
      {hasHalf && <Ionicons name="star-half" size={size} color={Colors.secondary} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Ionicons key={`empty-${i}`} name="star-outline" size={size} color={Colors.secondary} />
      ))}
      {showValue && <Text style={[styles.value, { fontSize: size }]}>{rating.toFixed(1)}</Text>}
      {count !== undefined && (
        <Text style={[styles.count, { fontSize: size - 2 }]}>({count})</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  value: {
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginLeft: Spacing.xs,
  },
  count: {
    color: Colors.textSecondary,
    marginLeft: 2,
  },
});
