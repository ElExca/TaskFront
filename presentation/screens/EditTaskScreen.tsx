import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/presentation/widgets/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEditTask } from '@/presentation/providers/EditTaskProvider';
import { useCategories } from '@/presentation/providers/CategoryProvider';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Subtask {
  title: string;
  completed: boolean;
}

const EditTaskScreen: React.FC = () => {
  const { task, loading, error, fetchTaskDetails, updateTask } = useEditTask();
  const { categories, fetchCategories } = useCategories();
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId } = route.params as { taskId: string };
  const [taskDetails, setTaskDetails] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [currentPickerField, setCurrentPickerField] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

  useEffect(() => {
    const loadTaskDetails = async () => {
      await fetchTaskDetails(taskId);
    };

    fetchCategories();
    loadTaskDetails();
  }, [taskId]);

  useEffect(() => {
    if (task) {
      setTaskDetails(task);
      setSelectedCategory(task.category);
    }
  }, [task]);

  const handleInputChange = (field: string, value: any) => {
    if (taskDetails) {
      setTaskDetails({ ...taskDetails, [field]: value });
    }
  };

  const showPicker = (field: string, mode: 'date' | 'time') => {
    setCurrentPickerField(field);
    setPickerMode(mode);
    if (mode === 'date') {
      setDatePickerVisible(true);
    } else {
      setTimePickerVisible(true);
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setDatePickerVisible(false);
    if (selectedDate) {
      handleInputChange(currentPickerField, selectedDate.toISOString().split('T')[0]);
    }
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    setTimePickerVisible(false);
    if (selectedTime) {
      handleInputChange(currentPickerField, selectedTime.toTimeString().split(' ')[0].substring(0, 8));
    }
  };

  const handleUpdateTask = async () => {
    if (taskDetails) {
      const updatedTaskDetails: any = {
        ...taskDetails,
        category: selectedCategory,
      };

      try {
        await updateTask(taskId, updatedTaskDetails);
        navigation.navigate('home'); // Reemplaza 'home' con el nombre de tu pantalla principal
      } catch (error) {
        setErrorMessage('Error en la actualización de la tarea.');
      }
    }
  };

  if (loading || !taskDetails) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />
      <Text style={styles.title}>Editar tarea</Text>

      <TextInput
        style={styles.input}
        placeholder="Título de tu tarea"
        onChangeText={(value) => handleInputChange('title', value)}
        value={taskDetails.title}
      />

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        onChangeText={(value) => handleInputChange('description', value)}
        value={taskDetails.description}
      />

      <TouchableOpacity
        style={styles.input}
        onPress={() => setCategoryModalVisible(true)}
      >
        <Text style={{ color: selectedCategory ? '#000' : '#AAA' }}>
          {selectedCategory || 'Selecciona una categoría'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Prioridad</Text>
      <View style={styles.priorityContainer}>
        {['alta', 'media', 'baja'].map((priority) => (
          <TouchableOpacity
            key={priority}
            style={[
              styles.priorityButton,
              taskDetails.priority === priority && styles.priorityButtonSelected,
            ]}
            onPress={() => handleInputChange('priority', priority)}
          >
            <Text style={styles.priorityButtonText}>{priority}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.input}
        onPress={() => showPicker('start_reminder_date', 'date')}
      >
        <Text style={{ color: taskDetails.start_reminder_date ? '#000' : '#AAA' }}>
          {taskDetails.start_reminder_date || 'Fecha de inicio de recordatorios'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.input}
        onPress={() => showPicker('due_date', 'date')}
      >
        <Text style={{ color: taskDetails.due_date ? '#000' : '#AAA' }}>
          {taskDetails.due_date || 'Fecha límite'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.input}
        onPress={() => showPicker('start_reminder_time', 'time')}
      >
        <Text style={{ color: taskDetails.start_reminder_time ? '#000' : '#AAA' }}>
          {taskDetails.start_reminder_time || 'Inicio de recordatorios'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.input}
        onPress={() => showPicker('end_reminder_time', 'time')}
      >
        <Text style={{ color: taskDetails.end_reminder_time ? '#000' : '#AAA' }}>
          {taskDetails.end_reminder_time || 'Fin de recordatorios'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.input}
        onPress={() => showPicker('due_time', 'time')}
      >
        <Text style={{ color: taskDetails.due_time ? '#000' : '#AAA' }}>
          {taskDetails.due_time || 'Hora límite'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Subtareas</Text>
      {taskDetails.subtasks.map((subtask: Subtask, index: number) => (
        <View key={index} style={styles.subtaskContainer}>
          <TextInput
            style={styles.subtaskInput}
            placeholder={`Subtarea ${index + 1}`}
            value={subtask.title}
            onChangeText={(value) => {
              const newSubtasks = [...taskDetails.subtasks];
              newSubtasks[index] = { ...subtask, title: value };
              handleInputChange('subtasks', newSubtasks);
            }}
          />
          <TouchableOpacity onPress={() => {
            const newSubtasks = taskDetails.subtasks.filter((_: any, i: number) => i !== index);
            handleInputChange('subtasks', newSubtasks);
          }}>
            <Ionicons name="trash" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={() => handleInputChange('subtasks', [...taskDetails.subtasks, { title: '', completed: false }])}>
        <Ionicons name="add" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.label}>Tipo</Text>
      <View style={styles.typeContainer}>
        {['individual', 'grupal', 'asignar'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              taskDetails.type === type && styles.typeButtonSelected,
            ]}
            onPress={() => handleInputChange('type', type)}
          >
            <Text style={styles.typeButtonText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleUpdateTask} disabled={loading}>
        <Text style={styles.submitButtonText}>Actualizar</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A9D8F',
    marginVertical: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priorityButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#EEE',
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  priorityButtonSelected: {
    backgroundColor: '#2A9D8F',
  },
  priorityButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  subtaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtaskInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  typeButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#EEE',
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#2A9D8F',
  },
  typeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#2A9D8F',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default EditTaskScreen;
