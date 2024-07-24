import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTasks } from '../providers/TaskProvider';
import TaskItem from '../widgets/TaskItem';
import Header from '../widgets/Header';

type RootStackParamList = {
  taskDetail: { taskId: string };
};

const AllTasksScreen: React.FC = () => {
  const { tasks, loading } = useTasks();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleTaskPress = (taskId: string) => {
    navigation.navigate('taskDetail', { taskId });
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Todas las Tareas</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TaskItem task={item} onPress={() => handleTaskPress(item.id)} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginVertical: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AllTasksScreen;
