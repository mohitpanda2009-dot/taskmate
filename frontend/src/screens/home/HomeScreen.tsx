import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
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
import { mockTasks, CATEGORIES, currentUser } from '../../utils/mockData';
import { useApp } from '../../context/AppContext';
import TaskCard from '../../components/TaskCard';
import CategoryChip from '../../components/CategoryChip';
import EmptyState from '../../components/EmptyState';

export default function HomeScreen({ navigation }: any) {
  const { currentRole, toggleRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  // Filter tasks based on role
  const doerTasks = mockTasks.filter(
    (t) =>
      t.status === 'open' &&
      t.creatorId !== currentUser.id &&
      (selectedCategory ? t.category === selectedCategory : true) &&
      (searchQuery
        ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true)
  );

  const creatorTasks = mockTasks.filter((t) => t.creatorId === currentUser.id);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {currentUser.name.split(' ')[0]} 👋</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={Colors.primary} />
            <Text style={styles.locationText}>{currentUser.location}</Text>
          </View>
        </View>

        {/* Role Toggle */}
        <TouchableOpacity style={styles.roleToggle} onPress={toggleRole} activeOpacity={0.7}>
          <View
            style={[
              styles.roleOption,
              currentRole === 'doer' && styles.roleOptionActive,
            ]}
          >
            <Text
              style={[
                styles.roleText,
                currentRole === 'doer' && styles.roleTextActive,
              ]}
            >
              Doer
            </Text>
          </View>
          <View
            style={[
              styles.roleOption,
              currentRole === 'creator' && styles.roleOptionActive,
            ]}
          >
            <Text
              style={[
                styles.roleText,
                currentRole === 'creator' && styles.roleTextActive,
              ]}
            >
              Creator
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {currentRole === 'doer' ? (
        /* DOER VIEW */
        <>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color={Colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search tasks..."
                placeholderTextColor={Colors.textLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color={Colors.textLight} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Category Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContent}
          >
            <CategoryChip
              label="All"
              selected={!selectedCategory}
              onPress={() => setSelectedCategory(null)}
            />
            {CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat.id}
                label={cat.label}
                icon={cat.icon}
                selected={selectedCategory === cat.id}
                onPress={() =>
                  setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
                }
              />
            ))}
          </ScrollView>

          {/* Task List */}
          <FlatList
            data={doerTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskCard
                task={item}
                onPress={() => navigation.navigate('TaskDetail', { task: item })}
              />
            )}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon="search-outline"
                title="No tasks found"
                subtitle="Try changing your filters or check back later"
              />
            }
          />

          {/* FAB - Map Toggle */}
          <TouchableOpacity style={styles.fab}>
            <Ionicons name="map" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </>
      ) : (
        /* CREATOR VIEW */
        <FlatList
          data={creatorTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              showStatus
              onPress={() => navigation.navigate('TaskDetail', { task: item })}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          ListHeaderComponent={
            <View style={styles.creatorHeader}>
              <Text style={styles.sectionTitle}>My Tasks</Text>
              <Text style={styles.taskCount}>{creatorTasks.length} tasks</Text>
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              icon="add-circle-outline"
              title="No tasks yet"
              subtitle="Create your first task and get it done by someone nearby!"
            />
          }
        />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.card,
    ...Shadow.sm,
  },
  greeting: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.full,
    padding: 3,
  },
  roleOption: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  roleOptionActive: {
    backgroundColor: Colors.primary,
  },
  roleText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  roleTextActive: {
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
    paddingVertical: Spacing.xs,
  },
  categoryScroll: {
    maxHeight: 48,
    marginTop: Spacing.md,
  },
  categoryContent: {
    paddingHorizontal: Spacing.lg,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: Spacing.xl,
    bottom: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
  },
  creatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  taskCount: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
});
