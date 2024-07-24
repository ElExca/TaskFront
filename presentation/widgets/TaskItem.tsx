import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Task {
  id: string;
  progress: number;
  title: string;
}

interface TaskItemProps {
  task: Task;
  onPress: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${task.progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{task.progress}% completado</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginVertical: 8,
  },
  progress: {
    height: 10,
    backgroundColor: '#2A9D8F',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#4A4A4A',
  },
});

export default TaskItem;
