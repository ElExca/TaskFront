import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/presentation/widgets/Header';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditTaskScreen: React.FC = () => {
  const currentUser = 'Usuario Actual'; // Reemplaza esto con el nombre del usuario actual
  const [categories, setCategories] = useState<string[]>(['Deportes', 'Hogar', 'Escuela', 'Salud']);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isNewCategoryModalVisible, setNewCategoryModalVisible] = useState(false);
  const [isMembersModalVisible, setMembersModalVisible] = useState(false);
  const [isAssigneesModalVisible, setAssigneesModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Salud');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [taskDetails, setTaskDetails] = useState({
    title: 'Primer tarea',
    description: 'Describe de que trata',
    category: 'Salud',
    priority: 'Baja',
    startDate: '11-12-2024',
    endDate: '12-12-2024',
    startTime: '07:00 a.m.',
    endTime: '08:00 a.m.',
    limitTime: '12:00 a.m.',
    subtasks: ['Subtarea 1', 'Subtarea 2'],
    type: 'Individual',
  });
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [currentPickerField, setCurrentPickerField] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setTaskDetails({ ...taskDetails, [field]: value });
  };

  const addCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory]);
      setSelectedCategory(newCategory);
      setNewCategory('');
      setNewCategoryModalVisible(false);
      setCategoryModalVisible(false);
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
      handleInputChange(currentPickerField, selectedTime.toTimeString().split(' ')[0].substring(0, 5));
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
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonSelected,
              ]}
              onPress={() => {
                setSelectedCategory(category);
                setCategoryModalVisible(false);
              }}
            >
              <Text style={styles.categoryButtonText}>{category}</Text>
            </TouchableOpacity>
          ))}
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

  const renderMembersModal = () => (
    <Modal
      transparent={true}
      visible={isMembersModalVisible}
      onRequestClose={() => setMembersModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Selecciona los integrantes</Text>
          {['Angel Alvarez', 'Diego Penagos', 'Silvia Nigenda', 'Paola Canseco', 'Mariana Cruz', 'Azucena Lopez'].map((member, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                selectedMembers.includes(member) && styles.categoryButtonSelected,
              ]}
              onPress={() => {
                if (selectedMembers.includes(member)) {
                  setSelectedMembers(selectedMembers.filter(m => m !== member));
                } else {
                  setSelectedMembers([...selectedMembers, member]);
                }
              }}
            >
              <Text style={styles.categoryButtonText}>{member}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.modalButton} onPress={() => setMembersModalVisible(false)}>
            <Ionicons name="checkmark" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderAssigneesModal = () => (
    <Modal
      transparent={true}
      visible={isAssigneesModalVisible}
      onRequestClose={() => setAssigneesModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Selecciona quienes harán la tarea</Text>
          {['Angel Alvarez', 'Diego Penagos', 'Silvia Nigenda', 'Paola Canseco', 'Mariana Cruz', 'Azucena Lopez'].map((assignee, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                selectedAssignees.includes(assignee) && styles.categoryButtonSelected,
              ]}
              onPress={() => {
                if (selectedAssignees.includes(assignee)) {
                  setSelectedAssignees(selectedAssignees.filter(a => a !== assignee));
                } else {
                  setSelectedAssignees([...selectedAssignees, assignee]);
                }
              }}
            >
              <Text style={styles.categoryButtonText}>{assignee}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.modalButton} onPress={() => setAssigneesModalVisible(false)}>
            <Ionicons name="checkmark" size={24} color="white" />
        </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderCategoryModal()}
      {renderNewCategoryModal()}
      {renderMembersModal()}
      {renderAssigneesModal()}
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
        {['Alta', 'Media', 'Baja'].map((priority) => (
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
        onPress={() => showPicker('startDate', 'date')}
      >
        <Text style={{ color: taskDetails.startDate ? '#000' : '#AAA' }}>
          {taskDetails.startDate || 'Fecha de inicio de recordatorios'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.input}
        onPress={() => showPicker('endDate', 'date')}
      >
        <Text style={{ color: taskDetails.endDate ? '#000' : '#AAA' }}>
          {taskDetails.endDate || 'Fecha límite'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.input}
        onPress={() => showPicker('startTime', 'time')}
      >
        <Text style={{ color: taskDetails.startTime ? '#000' : '#AAA' }}>
          {taskDetails.startTime || 'Inicio de recordatorios'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.input}
        onPress={() => showPicker('endTime', 'time')}
      >
        <Text style={{ color: taskDetails.endTime ? '#000' : '#AAA' }}>
          {taskDetails.endTime || 'Fin de recordatorios'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.input}
        onPress={() => showPicker('limitTime', 'time')}
      >
        <Text style={{ color: taskDetails.limitTime ? '#000' : '#AAA' }}>
          {taskDetails.limitTime || 'Hora límite'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Subtareas</Text>
      {taskDetails.subtasks.map((subtask, index) => (
        <View key={index} style={styles.subtaskContainer}>
          <TextInput
            style={styles.subtaskInput}
            placeholder={`Subtarea ${index + 1}`}
            value={subtask}
            onChangeText={(value) => {
              const newSubtasks = [...taskDetails.subtasks];
              newSubtasks[index] = value;
              handleInputChange('subtasks', newSubtasks);
            }}
          />
          <TouchableOpacity onPress={() => {
            const newSubtasks = taskDetails.subtasks.filter((_, i) => i !== index);
            handleInputChange('subtasks', newSubtasks);
          }}>
            <Ionicons name="trash" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={() => handleInputChange('subtasks', [...taskDetails.subtasks, ''])}>
        <Ionicons name="add" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.label}>Tipo</Text>
      <View style={styles.typeContainer}>
        {['Individual', 'Grupal', 'Asignar'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              taskDetails.type === type && styles.typeButtonSelected,
            ]}
            onPress={() => {
              handleInputChange('type', type);
              if (type === 'Grupal') {
                setSelectedMembers([currentUser]);
              } else {
                setSelectedMembers([]);
              }
            }}
          >
            <Text style={styles.typeButtonText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {taskDetails.type === 'Grupal' && (
        <View>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setMembersModalVisible(true)}
          >
            <Text style={{ color: '#000' }}>Seleccionar integrantes</Text>
          </TouchableOpacity>
          <Text style={styles.label}>Integrantes</Text>
          <View style={styles.selectedItemsContainer}>
            {selectedMembers.map((member, index) => (
              <View key={index} style={styles.selectedItem}>
                <Text style={styles.selectedItemText}>{member}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {taskDetails.type === 'Asignar' && (
        <View>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setAssigneesModalVisible(true)}
          >
            <Text style={{ color: '#000' }}>Seleccionar asignados</Text>
          </TouchableOpacity>
          <Text style={styles.label}>Asignados</Text>
          <View style={styles.selectedItemsContainer}>
            {selectedAssignees.map((assignee, index) => (
              <View key={index} style={styles.selectedItem}>
                <Text style={styles.selectedItemText}>{assignee}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.submitButton}>
        <Ionicons name="checkmark" size={24} color="white" />
      </TouchableOpacity>
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
  selectedItem: {
    backgroundColor: '#EEE',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedItemText: {
    color: '#000',
  },
});

export default EditTaskScreen;
