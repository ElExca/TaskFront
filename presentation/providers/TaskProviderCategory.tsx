import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: string;
  progress: number;
  title: string;
}

interface TaskProviderProps {
  children: ReactNode;
}

const TaskContext = createContext<{ tasks: Task[]; fetchTasksByCategory: (category: string) => void; loading: boolean } | undefined>(undefined);

export const TaskProviderCategory: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTasksByCategory = async (category: string) => {
    setLoading(true);
    console.log(`Fetching tasks for category: ${category}`);
    try {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      if (jwtToken) {
        const response = await fetch(`http://18.211.141.106:5003/tasks/category?category=${category}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Data received:', data);
          setTasks(data);
        } else {
          console.error('Error al obtener las tareas por categoría');
        }
      }
    } catch (error) {
      console.error('Error al recuperar las tareas por categoría', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, fetchTasksByCategory, loading }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasksCategory = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasksCategory must be used within a TaskProviderCategory');
  }
  return context;
};
