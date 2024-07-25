import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/presentation/widgets/Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEditTask } from '@/presentation/providers/EditTaskProvider';
import { useCategories } from '@/presentation/providers/CategoryProvider';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [selectedType, setSelectedType] = useState<string>('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [currentPickerField, setCurrentPickerField] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isNewCategoryModalVisible, setNewCategoryModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isWarningModalVisible, setWarningModalVisible] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isMembersModalVisible, setMembersModalVisible] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<{ user_id: string, username: string }[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<{ user_id: string, username: string }[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  const currentUser = 'Usuario Actual'; // Reemplaza esto con el nombre del usuario actual

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
      setSelectedType(task.type);
      if (task.type === 'grupal') {
        fetchAllUsers().then(() => {
          setSelectedMembers(Array.isArray(task.user_id) ? task.user_id.map((user_id: string) => ({ user_id, username: user_id })) : []);
        });
      } else if (task.type === 'asignar') {
        fetchAllUsers().then(() => {
          setSelectedAssignees(Array.isArray(task.user_id) ? task.user_id.map((user_id: string) => ({ user_id, username: user_id })) : []);
        });
      }
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
      const date = new Date(selectedDate);
      const isoDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      handleInputChange(currentPickerField, isoDate);
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
      const user_ids = taskDetails.type === 'Asignar' ? selectedAssignees.map(assignee => assignee.user_id) : selectedMembers.map(member => member.user_id).filter(user_id => user_id !== currentUser);
      const updatedTaskDetails: any = {
        ...taskDetails,
        category: selectedCategory,
        user_ids,
        type: taskDetails.type.toLowerCase(),
      };

      console.log('Sending updated task data:', updatedTaskDetails);

      try {
        await updateTask(taskId, updatedTaskDetails);
        navigation.navigate('home'); // Reemplaza 'home' con el nombre de tu pantalla principal
      } catch (error) {
        setErrorMessage('Error en la actualización de la tarea.');
      }
    }
  };

  const addCategory = async () => {
    if (newCategory.trim()) {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      if (jwtToken) {
        await fetch('http://18.211.141.106:5002/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newCategory }),
        });
        fetchCategories();
        setSelectedCategory(newCategory);
        setNewCategory('');
        setNewCategoryModalVisible(false);
        setCategoryModalVisible(false);
      }
    }
  };

  const fetchAllUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);

    try {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      if (jwtToken) {
        const response = await fetch('http://18.211.141.106:5001/usernames', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch users');
        }

        setAllUsers(data.users || []);
      }
    } catch (error) {
      setUsersError((error as Error).message);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleTypeChange = (newType: string) => {
    const currentType = taskDetails.type;
    if (
      (currentType === 'individual' && newType === 'asignar') ||
      (currentType === 'grupal' && newType !== 'grupal') ||
      (currentType === 'asignar' && newType === 'grupal')
    ) {
      let warning = '';
      if (currentType === 'individual' && newType === 'asignar') {
        warning = 'No puedes cambiar una tarea individual a asignada.';
      } else if (currentType === 'grupal') {
        warning = 'No puedes cambiar una tarea grupal a individual o asignada.';
      } else if (currentType === 'asignar' && newType === 'grupal') {
        warning = 'No puedes cambiar una tarea asignada a grupal.';
      }
      setWarningMessage(warning);
      setWarningModalVisible(true);
    } else {
      handleInputChange('type', newType);
      setSelectedType(newType);
      if (newType === 'grupal') {
        fetchAllUsers().then(() => {
          setSelectedMembers([{ user_id: currentUser, username: currentUser }]);
        });
      } else if (newType === 'asignar') {
        fetchAllUsers().then(() => {
          setSelectedAssignees([]);
        });
      } else {
        setSelectedMembers([]);
        setSelectedAssignees([]);
      }
    }
  };

  const renderCategoryModal = () => (
    <Modal
      transparent={true}
      visible={isCategoryModalVisible}
      onRequestClose={() => setCategoryModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Selecciona una categoría</Text>
          <ScrollView style={styles.modalScrollView}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.name && styles.categoryButtonSelected,
                ]}
                onPress={() => {
                  setSelectedCategory(category.name);
                  setCategoryModalVisible(false);
                }}
              >
                <Text style={styles.categoryButtonText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.addCategoryButton}
            onPress={() => {
              setCategoryModalVisible(false);
              setNewCategoryModalVisible(true);
            }}
          >
            <Ionicons name="add" size={24} color="black" />
            <Text style={styles.addCategoryText}>Agregar categoría</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  
  const renderNewCategoryModal = () => (
    <Modal
      transparent={true}
      visible={isNewCategoryModalVisible}
      onRequestClose={() => setNewCategoryModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Crear categoría</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Nombre de categoría"
            value={newCategory}
            onChangeText={setNewCategory}
          />
          <TouchableOpacity style={styles.modalButton} onPress={addCategory}>
            <Ionicons name="checkmark" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderWarningModal = () => (
    <Modal
      transparent={true}
      visible={isWarningModalVisible}
      onRequestClose={() => setWarningModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Advertencia</Text>
          <Text style={styles.warningText}>{warningMessage}</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setWarningModalVisible(false)}
          >
            <Ionicons name="checkmark" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderMembersModal = () => (
    <Modal
      transparent={true}
      visible={isMembersModalVisible}
      onRequestClose={() => setMembersModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Selecciona los integrantes</Text>
          {usersLoading ? (
            <ActivityIndicator size="large" color="#2A9D8F" />
          ) : usersError ? (
            <Text style={styles.errorText}>{usersError}</Text>
          ) : (
            allUsers.map((user, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.memberButton,
                  selectedMembers.some(member => member.user_id === user.user_id) && styles.memberButtonSelected,
                ]}
                onPress={() => {
                  if (selectedMembers.some(member => member.user_id === user.user_id)) {
                    setSelectedMembers(selectedMembers.filter(member => member.user_id !== user.user_id));
                  } else {
                    setSelectedMembers([...selectedMembers, { user_id: user.user_id, username: user.username }]);
                  }
                }}
              >
                <Text style={styles.memberButtonText}>{user.username}</Text>
              </TouchableOpacity>
            ))
          )}
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setMembersModalVisible(false)}
          >
            <Ionicons name="checkmark" size={24} color="white" />
            <Text style={styles.addCategoryText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading || !taskDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A9D8F" />
      </View>
    );
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
              selectedType === type && styles.typeButtonSelected,
            ]}
            onPress={() => handleTypeChange(type)}
          >
            <Text style={styles.typeButtonText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {taskDetails.type === 'grupal' && (
        <TouchableOpacity
          style={styles.input}
          onPress={() => setMembersModalVisible(true)}
        >
          <Text style={{ color: '#000' }}>Seleccionar integrantes</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.label}>Integrantes</Text>
      <View style={styles.selectedItemsContainer}>
        {(taskDetails.type === 'grupal' ? selectedMembers : selectedAssignees).map((user, index) => (
          <View key={index} style={styles.selectedItem}>
            <Text style={styles.selectedItemText}>{user.username}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleUpdateTask} disabled={loading}>
        <Text style={styles.submitButtonText}>Actualizar</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {datePickerVisible && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {timePickerVisible && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {renderCategoryModal()}
      {renderNewCategoryModal()}
      {renderWarningModal()}
      {renderMembersModal()}
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  modalScrollView: {
    maxHeight: 300,
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#2A9D8F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  categoryButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#EEE',
    marginVertical: 4,
    width: '100%',
    alignItems: 'center',
  },
  categoryButtonSelected: {
    backgroundColor: '#2A9D8F',
  },
  categoryButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  addCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  addCategoryText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
 warningText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  selectedItem: {
    backgroundColor: '#EEE',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  selectedItemText: {
    color: '#000',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
  memberButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#EEE',
    marginVertical: 4,
    width: '100%',
    alignItems: 'center',
  },
  memberButtonSelected: {
    backgroundColor: '#2A9D8F',
  },
  memberButtonText: {
    color: '#000',
  },
});

export default EditTaskScreen;