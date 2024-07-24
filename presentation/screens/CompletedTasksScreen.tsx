import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTasks } from '@/presentation/providers/TaskProviderProgress';
import TaskItem from '@/presentation/widgets/TaskItem';
import Header from '@/presentation/widgets/Header';

type RootStackParamList = {
  taskDetail: { taskId: string };
  // Define otros tipos de navegación si los tienes
};

const CompletedTasksScreen: React.FC = () => {
  const { tasks, fetchTasksByProgress, loading } = useTasks();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchTasksByProgress('completada');
  }, []);

  const handleTaskPress = (taskId: string) => {
    navigation.navigate('taskDetail', { taskId });
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Tareas Completadas</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CompletedTasksScreen;
