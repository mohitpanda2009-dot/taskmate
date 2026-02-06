import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing, Shadow } from '../utils/theme';
import { formatCurrency } from '../utils/helpers';
import StatusBadge from './StatusBadge';
import { Task } from '../utils/mockData';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  showStatus?: boolean;
}

export default function TaskCard({ task, onPress, showStatus = false }: TaskCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.categoryTag}>
          <Ionicons name={task.categoryIcon as any} size={12} color={Colors.primary} />
          <Text style={styles.categoryText}>{task.category}</Text>
        </View>
        <Text style={styles.budget}>{formatCurrency(task.budget)}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {task.title}
      </Text>

      <Text style={styles.description} numberOfLines={2}>
        {task.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{task.distance || task.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{task.createdAt}</Text>
          </View>
          {task.applicantCount > 0 && (
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{task.applicantCount}</Text>
            </View>
          )}
        </View>
        {showStatus && <StatusBadge status={task.status} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '12',
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  categoryText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  budget: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.secondary,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
});
