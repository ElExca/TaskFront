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

const sanitizeText = (text: string) => {
  return text.replace(/['"]/g, ''); 
};

export const TaskProviderCategory: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTasksByCategory = async (category: string) => {
    setLoading(true);

    try {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      if (jwtToken) {
        const response = await fetch(`https://api-gateway.zapto.org:5000/tasks-api/tasks/category?category=${category}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();

          const sanitizedTasks = data.map((task: Task) => ({
            ...task,
            title: sanitizeText(task.title),
          }));

          setTasks(sanitizedTasks);
        } else {
        }
      }
    } catch (error) {
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
