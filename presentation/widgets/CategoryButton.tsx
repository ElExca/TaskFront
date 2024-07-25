import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface CategoryButtonProps {
  category: string;
  taskCount: number;
  color: string;
  onPress: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, taskCount, color, onPress }) => {
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, { backgroundColor: color }, animatedStyle]}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.categoryText}>{category}</Text>
        <Text style={styles.taskCountText}>{taskCount} 5 tareas</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexBasis: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  taskCountText: {
    fontSize: 14,
    color: '#fff',
  },
});

export default CategoryButton;
