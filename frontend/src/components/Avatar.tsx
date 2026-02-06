import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontSize, FontWeight, BorderRadius } from '../utils/theme';
import { getInitials } from '../utils/helpers';

interface AvatarProps {
  name: string;
  uri?: string;
  size?: number;
  style?: ViewStyle;
  showOnline?: boolean;
  online?: boolean;
}

export default function Avatar({
  name,
  uri,
  size = 44,
  style,
  showOnline = false,
  online = false,
}: AvatarProps) {
  const fontSize = size * 0.38;
  const onlineDot = size * 0.28;

  return (
    <View style={[{ width: size, height: size }, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
        </View>
      )}
      {showOnline && (
        <View
          style={[
            styles.onlineDot,
            {
              width: onlineDot,
              height: onlineDot,
              borderRadius: onlineDot / 2,
              backgroundColor: online ? Colors.online : Colors.offline,
              borderWidth: onlineDot * 0.18,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: Colors.border,
  },
  placeholder: {
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: FontWeight.bold,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderColor: Colors.card,
  },
});
