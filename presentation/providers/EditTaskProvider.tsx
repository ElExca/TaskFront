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
  success: boolean;
  fetchTaskDetails: (taskId: string) => void;
  updateTask: (taskId: string, taskData: Task) => Promise<void>;
  setTask: React.Dispatch<React.SetStateAction<Task | null>>;
  clearStatus: () => void;
}

const EditTaskContext = createContext<EditTaskContextProps | undefined>(undefined);

interface EditTaskProviderProps {
  children: ReactNode;
}

const decodeUnicode = (data: any) => {
  return JSON.parse(JSON.stringify(data), (key, value) =>
    typeof value === 'string'
      ? value.replace(/\\u[\dA-F]{4}/gi, match => {
          return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        })
      : value
  );
};

const sanitizeText = (text: string) => {
  return text.replace(/['"]/g, ''); 
};

export const EditTaskProvider: React.FC<EditTaskProviderProps> = ({ children }) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const fetchTaskDetails = async (taskId: string) => {
    setLoading(true);
    setError(null);

    try {
    

      const jwtToken = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(`https://api-gateway.zapto.org:5000/tasks-api/task/${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

   

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch task details');
      }

   
      const decodedData = decodeUnicode(data);

  
      const sanitizedTask = {
        ...decodedData,
        title: sanitizeText(decodedData.title),
        description: sanitizeText(decodedData.description),
        subtasks: decodedData.subtasks.map((subtask: Subtask) => ({
          ...subtask,
          title: sanitizeText(subtask.title),
        })),
      };

      setTask(sanitizedTask);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: string, taskData: Task) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const jwtToken = await AsyncStorage.getItem('jwtToken');

     
      const sanitizedTaskData = {
        ...taskData,
        title: sanitizeText(taskData.title),
        description: sanitizeText(taskData.description),
        subtasks: taskData.subtasks.map((subtask) => ({
          ...subtask,
          title: sanitizeText(subtask.title),
        })),
      };

    

      const response = await fetch(`https://api-gateway.zapto.org:5000/tasks-api/edit/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedTaskData),
      });

      const data = await response.json();

      if (!response.ok) {
      
        throw new Error(data.error || 'Failed to update task');
      }

      

      await fetchTaskDetails(taskId);
      setSuccess(true);
    } catch (error) {
    
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const clearStatus = () => {
    setError(null);
    setSuccess(false);
  };

  return (
    <EditTaskContext.Provider value={{ task, loading, error, success, fetchTaskDetails, updateTask, setTask, clearStatus }}>
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
