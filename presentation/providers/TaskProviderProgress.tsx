import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: string;
  progress: number;
  title: string;
  status: string;
}

interface TaskProviderProps {
  children: ReactNode;
}

interface TaskContextProps {
  tasks: Task[];
  fetchTasksByProgress: (progressStatus: string) => void;
  loading: boolean;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProviderProgress: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTasksByProgress = async (progressStatus: string) => {
    setLoading(true);
    try {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      if (jwtToken) {
        const response = await fetch(`http://18.211.141.106:5003/tasks/progress?progress_status=${progressStatus}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
        }
      }
    } catch (error) {
      console.error('Error al recuperar las tareas por estado de progreso', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, fetchTasksByProgress, loading }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
