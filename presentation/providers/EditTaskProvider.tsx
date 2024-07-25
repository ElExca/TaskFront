import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Subtask {
  title: string;
  completed: boolean;
}

interface Task {
  user_id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  start_reminder_date: string;
  due_date: string;
  due_time: string;
  start_reminder_time: string;
  end_reminder_time: string;
  subtasks: Subtask[];
  type: string;
}

interface EditTaskContextProps {
  task: Task | null;
  loading: boolean;
  error: string | null;
  fetchTaskDetails: (taskId: string) => void;
  updateTask: (taskId: string, taskData: Task) => Promise<void>;
  setTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

const EditTaskContext = createContext<EditTaskContextProps | undefined>(undefined);

interface EditTaskProviderProps {
  children: ReactNode;
}

export const EditTaskProvider: React.FC<EditTaskProviderProps> = ({ children }) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskDetails = async (taskId: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching task details for ID:', taskId); // Imprimir el ID de la tarea que se está buscando

      const jwtToken = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(`http://18.211.141.106:5003/task/${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      console.log('Response Status:', response.status); // Imprimir el estado de la respuesta
      console.log('Response Data:', data); // Imprimir el JSON recibido

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch task details');
      }

      setTask(data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, taskData: Task) => {
    setLoading(true);
    setError(null);

    try {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(`http://18.211.141.106:5003/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update task');
      }

      console.log('Updated Task Data:', taskData); // Imprimir los datos enviados

      // Update the task details after updating the task
      await fetchTaskDetails(taskId);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditTaskContext.Provider value={{ task, loading, error, fetchTaskDetails, updateTask, setTask }}>
      {children}
    </EditTaskContext.Provider>
  );
};

export const useEditTask = () => {
  const context = useContext(EditTaskContext);
  if (context === undefined) {
    throw new Error('useEditTask must be used within an EditTaskProvider');
  }
  return context;
};
