import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
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
import { CATEGORIES } from '../../utils/mockData';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function CreateTaskScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!description.trim()) errs.description = 'Description is required';
    if (!selectedCategory) errs.category = 'Select a category';
    if (!budget || Number(budget) <= 0) errs.budget = 'Enter a valid budget';
    if (!location.trim()) errs.location = 'Location is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePost = () => {
    if (!validate()) return;
    Alert.alert(
      'Task Posted! 🎉',
      'Your task has been published. You will be notified when someone applies.',
      [
        {
          text: 'OK',
          onPress: () => {
            setTitle('');
            setDescription('');
            setSelectedCategory('');
            setBudget('');
            setLocation('');
            setDeadline('');
            setPhotos([]);
          },
        },
      ]
    );
  };

  const handlePickPhoto = () => {
    // Mock photo addition
    if (photos.length < 3) {
      setPhotos([...photos, `photo_${photos.length + 1}`]);
    } else {
      Alert.alert('Limit reached', 'Maximum 3 photos allowed');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Task</Text>
        <Text style={styles.headerSubtitle}>Post a task and find help nearby</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <Input
          label="Task Title"
          placeholder="e.g. Submit form at passport office"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        {/* Description */}
        <Input
          label="Description"
          placeholder="Describe what needs to be done, any specific instructions..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          error={errors.description}
          containerStyle={{ marginBottom: Spacing.lg }}
        />

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryItem,
                selectedCategory === cat.id && styles.categoryItemSelected,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={cat.icon as any}
                size={24}
                color={selectedCategory === cat.id ? Colors.primary : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategory === cat.id && styles.categoryLabelSelected,
                ]}
                numberOfLines={1}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Budget */}
        <Input
          label="Budget"
          placeholder="Enter amount"
          value={budget}
          onChangeText={(t) => setBudget(t.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          error={errors.budget}
          leftIcon={
            <Text style={styles.rupeeIcon}>₹</Text>
          }
        />

        {/* Location */}
        <Input
          label="Location"
          placeholder="Where should this task be done?"
          value={location}
          onChangeText={setLocation}
          error={errors.location}
          leftIcon={<Ionicons name="location-outline" size={18} color={Colors.textSecondary} />}
        />

        {/* Map Placeholder */}
        <TouchableOpacity style={styles.mapPicker}>
          <Ionicons name="map-outline" size={24} color={Colors.primary} />
          <Text style={styles.mapPickerText}>Pick on Map</Text>
        </TouchableOpacity>

        {/* Deadline */}
        <Input
          label="Deadline (optional)"
          placeholder="e.g. Tomorrow 5:00 PM"
          value={deadline}
          onChangeText={setDeadline}
          leftIcon={<Ionicons name="calendar-outline" size={18} color={Colors.textSecondary} />}
        />

        {/* Photos */}
        <Text style={styles.label}>Photos (optional)</Text>
        <View style={styles.photosRow}>
          {photos.map((_, index) => (
            <View key={index} style={styles.photoThumb}>
              <Ionicons name="image" size={24} color={Colors.primary} />
              <TouchableOpacity
                style={styles.photoRemove}
                onPress={() => setPhotos(photos.filter((__, i) => i !== index))}
              >
                <Ionicons name="close-circle" size={18} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ))}
          {photos.length < 3 && (
            <TouchableOpacity style={styles.addPhotoButton} onPress={handlePickPhoto}>
              <Ionicons name="camera-outline" size={24} color={Colors.textSecondary} />
              <Text style={styles.addPhotoText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Post Button */}
        <Button
          title="Post Task"
          onPress={handlePost}
          size="lg"
          icon={<Ionicons name="paper-plane" size={18} color="#FFFFFF" />}
          style={{ marginTop: Spacing.xxl }}
        />

        <View style={{ height: 40 }} />
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
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    ...Shadow.sm,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.error,
    marginBottom: Spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  categoryItem: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 4,
  },
  categoryItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  categoryLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  rupeeIcon: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.secondary,
  },
  mapPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    borderRadius: BorderRadius.md,
    borderStyle: 'dashed',
    backgroundColor: Colors.primary + '06',
  },
  mapPickerText: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  photosRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  photoThumb: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  photoRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
  addPhotoButton: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  addPhotoText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
});
