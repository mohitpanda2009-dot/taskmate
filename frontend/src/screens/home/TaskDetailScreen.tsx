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
import { formatCurrency } from '../../utils/helpers';
import { mockApplications, currentUser, Task } from '../../utils/mockData';
import { useApp } from '../../context/AppContext';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import RatingStars from '../../components/RatingStars';
import StatusBadge from '../../components/StatusBadge';

export default function TaskDetailScreen({ navigation, route }: any) {
  const task: Task = route.params.task;
  const { currentRole } = useApp();
  const isCreator = task.creatorId === currentUser.id;
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setApplied(true);
    Alert.alert('Applied!', 'Your application has been sent to the task creator.', [
      { text: 'OK' },
    ]);
  };

  const handleAccept = (applicantName: string) => {
    Alert.alert(
      'Accept Applicant',
      `Accept ${applicantName} for this task?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => Alert.alert('Accepted', `${applicantName} has been notified.`),
        },
      ]
    );
  };

  const handleReject = (applicantName: string) => {
    Alert.alert('Reject', `Reject ${applicantName}'s application?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive' },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <TouchableOpacity>
          <Ionicons name="share-social-outline" size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Status + Category */}
        <View style={styles.topRow}>
          <View style={styles.categoryTag}>
            <Ionicons name={task.categoryIcon as any} size={14} color={Colors.primary} />
            <Text style={styles.categoryText}>{task.category}</Text>
          </View>
          <StatusBadge status={task.status} size="md" />
        </View>

        {/* Title & Budget */}
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.budget}>{formatCurrency(task.budget)}</Text>

        {/* Description */}
        <Text style={styles.sectionLabel}>Description</Text>
        <Text style={styles.description}>{task.description}</Text>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={18} color={Colors.primary} />
            <View>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{task.location}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={18} color={Colors.primary} />
            <View>
              <Text style={styles.detailLabel}>Deadline</Text>
              <Text style={styles.detailValue}>{task.deadline}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={18} color={Colors.primary} />
            <View>
              <Text style={styles.detailLabel}>Applicants</Text>
              <Text style={styles.detailValue}>{task.applicantCount} people</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
            <View>
              <Text style={styles.detailLabel}>Posted</Text>
              <Text style={styles.detailValue}>{task.createdAt}</Text>
            </View>
          </View>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={40} color={Colors.textLight} />
          <Text style={styles.mapText}>{task.location}</Text>
          {task.distance && (
            <Text style={styles.distanceText}>{task.distance} away</Text>
          )}
        </View>

        {/* Creator Card (for doers) */}
        {!isCreator && (
          <>
            <Text style={styles.sectionLabel}>Posted by</Text>
            <View style={styles.creatorCard}>
              <Avatar name={task.creatorName} size={48} />
              <View style={styles.creatorInfo}>
                <Text style={styles.creatorName}>{task.creatorName}</Text>
                <RatingStars rating={task.creatorRating} size={12} />
              </View>
              <TouchableOpacity style={styles.chatButton}>
                <Ionicons name="chatbubble-outline" size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Applicants List (for creators) */}
        {isCreator && task.status === 'open' && (
          <>
            <Text style={styles.sectionLabel}>
              Applicants ({mockApplications.length})
            </Text>
            {mockApplications.map((app) => (
              <View key={app.id} style={styles.applicantCard}>
                <View style={styles.applicantTop}>
                  <Avatar name={app.doerName} size={44} />
                  <View style={styles.applicantInfo}>
                    <Text style={styles.applicantName}>{app.doerName}</Text>
                    <View style={styles.applicantMeta}>
                      <RatingStars rating={app.doerRating} size={11} />
                      <Text style={styles.applicantTasks}>
                        · {app.doerTasksCompleted} tasks done
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.applicantMessage}>"{app.message}"</Text>
                <View style={styles.applicantActions}>
                  <Button
                    title="Reject"
                    variant="outline"
                    size="sm"
                    fullWidth={false}
                    onPress={() => handleReject(app.doerName)}
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Accept"
                    size="sm"
                    fullWidth={false}
                    onPress={() => handleAccept(app.doerName)}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Button */}
      {!isCreator && task.status === 'open' && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomBudget}>
            <Text style={styles.bottomBudgetLabel}>Budget</Text>
            <Text style={styles.bottomBudgetValue}>{formatCurrency(task.budget)}</Text>
          </View>
          <Button
            title={applied ? 'Applied ✓' : 'Apply Now'}
            onPress={handleApply}
            disabled={applied}
            fullWidth={false}
            style={{ flex: 1 }}
            size="lg"
          />
        </View>
      )}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '12',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  categoryText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  title: {
    fontSize: FontSize.xxl + 2,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  budget: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.secondary,
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    marginTop: Spacing.xl,
  },
  description: {
    fontSize: FontSize.md + 1,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: '47%',
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadow.sm,
  },
  detailLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    marginTop: 1,
  },
  mapPlaceholder: {
    height: 160,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  mapText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  distanceText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
    marginTop: 2,
  },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadow.sm,
  },
  creatorInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  creatorName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applicantCard: {
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  applicantTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applicantInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  applicantName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  applicantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  applicantTasks: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  applicantMessage: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginVertical: Spacing.md,
    lineHeight: 20,
  },
  applicantActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
    ...Shadow.lg,
  },
  bottomBudget: {
    alignItems: 'center',
  },
  bottomBudgetLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  bottomBudgetValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.secondary,
  },
});
