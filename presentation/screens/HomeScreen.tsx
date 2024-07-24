import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTasks as useTasksProgress } from '@/presentation/providers/TaskProviderProgress';
import { useCategories } from '@/presentation/providers/CategoryProvider';
import Header from '@/presentation/widgets/Header';
import ProgressBar from '@/presentation/widgets/ProgressBar';
import CategoryButton from '@/presentation/widgets/CategoryButton';
import PerformanceChart from '@/presentation/widgets/PerformanceChart';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

type RootStackParamList = {
  login: undefined;
  register: undefined;
  completedTasks: undefined;
  inProgressTasks: undefined;
  notStartedTasks: undefined;
  createtask: undefined;
  categoryTasks: { category: string };
  alltasks: undefined;
  "(tabs)": undefined;
  "+not-found": undefined;
  taskDetail: undefined;
};

const HomeScreen: React.FC = () => {
  const { tasks, loading, fetchTasksByProgress } = useTasksProgress();
  const { categories, fetchCategories } = useCategories();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    translateY.value = withTiming(0, { duration: 500 });
    fetchCategories();
    fetchTasksByProgress('all'); // Assumes you have a way to fetch all tasks
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  // Progreso de tareas ajustado a 100%, 50% y 5%
  const completedProgress = 100;
  const inProgressProgress = 50;
  const notStartedProgress = 5;

  const handleCategoryPress = (category: string) => {
    navigation.navigate('categoryTasks', { category });
  };

  const handleCreateTaskPress = () => {
    navigation.navigate('createtask');
  };

  const handleTaskDetailPress = () => {
    navigation.navigate('taskDetail');
  };

  const handleViewCompletedTasksPress = () => {
    navigation.navigate('completedTasks');
  };

  const handleViewInProgressTasksPress = () => {
    navigation.navigate('inProgressTasks');
  };

  const handleViewNotStartedTasksPress = () => {
    navigation.navigate('notStartedTasks');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A9D8F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView>
        <Animated.View style={[styles.welcomeContainer, animatedStyle]}>
          <Text style={styles.greeting}>Hola, de nuevo</Text>
          <Text style={styles.username}>Paola Penagos</Text>
        </Animated.View>
        <Animated.View style={[styles.newTaskButtonContainer, animatedStyle]}>
          <TouchableOpacity style={styles.newTaskButton} onPress={handleCreateTaskPress}>
            <Text style={styles.newTaskButtonText}>Crear nueva tarea</Text>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.section, animatedStyle]}>
          <Text style={styles.sectionTitle}>Felicidades!!!</Text>
          <ProgressBar progress={completedProgress} color="#6BCB77" />
          <TouchableOpacity onPress={handleViewCompletedTasksPress}>
            <Text style={styles.sectionSubtitle}>Ver tareas completadas</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.section, animatedStyle]}>
          <Text style={styles.sectionTitle}>Te falta poco</Text>
          <ProgressBar progress={inProgressProgress} color="#FFD700" />
          <TouchableOpacity onPress={handleViewInProgressTasksPress}>
            <Text style={styles.sectionSubtitle}>Ver tareas en proceso</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.section, animatedStyle]}>
          <Text style={styles.sectionTitle}>No te olvides!</Text>
          <ProgressBar progress={notStartedProgress} color="#FF6B6B" />
          <TouchableOpacity onPress={handleViewNotStartedTasksPress}>
            <Text style={styles.sectionSubtitle}>Ver tareas sin iniciar</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.section, animatedStyle]}>
          <Text style={styles.sectionTitle}>Ver tareas de:</Text>
          <View style={styles.categoryContainer}>
            {categories.map((item) => (
              <CategoryButton
                key={item._id}
                category={item.name}
                taskCount={item.taskCount}
                color={item.color}
                onPress={() => handleCategoryPress(item.name)}
              />
            ))}
          </View>
        </Animated.View>
        <Animated.View style={[styles.section, animatedStyle]}>
          <PerformanceChart
            completed={completedProgress}
            inProgress={inProgressProgress}
            notStarted={notStartedProgress}
          />
          <TouchableOpacity onPress={() => navigation.navigate('alltasks')}>
            <Text style={styles.viewAllTasksText}>Ver todas mis tareas</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  welcomeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  greeting: {
    fontSize: 24,
    color: '#4A4A4A',
  },
  username: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2A9D8F',
  },
  newTaskButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  newTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2A9D8F',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  newTaskButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: '#9E9E9E',
    marginTop: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  viewAllTasksText: {
    color: '#2A9D8F',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2A9D8F',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
