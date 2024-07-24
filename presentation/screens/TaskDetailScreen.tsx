import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '@/presentation/widgets/Header';

const TaskDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const [task, setTask] = useState({
    title: 'Título',
    description: 'Describe de que trata Describe de que trata Describe de que trata Describe de que trata Describe de que trata',
    category: 'Salud',
    priority: 'Baja',
    type: 'Individual',
    progress: 50,
    startDate: '11-12-2024',
    reminderTime: '07:00 a.m. - 08:00 p.m.',
    endDate: '12-12-2024 9:30 a.m',
    subtasks: [
      { title: 'Subtarea 1', completed: true },
      { title: 'Subtarea 2', completed: false },
    ],
    members: ['Integrante 1', 'Integrante 2', 'Integrante 3'],
  });
  const [modalVisible, setModalVisible] = useState(false);

  const handleEditPress = () => {
    // Navegar a la pantalla de edición de tarea
    navigation.navigate('editTask', { task });
  };

  const handleDeletePress = () => {
    // Mostrar la ventana de confirmación
    setModalVisible(true);
  };

  const confirmDelete = () => {
    // Lógica para eliminar la tarea
    // Aquí puedes añadir la lógica para eliminar la tarea
    setModalVisible(false);
    Alert.alert('Tarea eliminada', 'La tarea ha sido eliminada correctamente.');
    // Regresar a la pantalla anterior o actualizar la lista de tareas
    navigation.goBack();
  };

  const handleSubtaskToggle = (index: number) => {
    const updatedSubtasks = [...task.subtasks];
    updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
    setTask({ ...task, subtasks: updatedSubtasks });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />
      <Text style={styles.title}>{task.title}</Text>
      <View style={styles.progressContainer}>
        <Text style={styles.type}>{task.type}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${task.progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{task.progress}% completado</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.description}>{task.description}</Text>
        <View style={styles.inlineRow}>
          <View style={styles.leftColumn}>
            <Text style={styles.labelBold}>Categoría:</Text>
            <Text style={styles.category}>{task.category}</Text>
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.labelBold}>Prioridad:</Text>
            <Text style={styles.priority}>{task.priority}</Text>
          </View>
        </View>
        {task.type === 'Grupal' && (
          <View style={styles.membersContainer}>
            <Ionicons name="people" size={24} color="black" />
            <Text style={styles.membersTitle}>Integrantes</Text>
            {task.members.map((member, index) => (
              <Text key={index} style={styles.member}>{member}</Text>
            ))}
          </View>
        )}
        <View style={styles.row}>
          <Ionicons name="calendar" size={24} color="black" />
          <Text style={styles.labelBold}>Fecha de inicio de recordatorios:</Text>
        </View>
        <TextInput style={styles.input} value={task.startDate} editable={false} />
        <View style={styles.row}>
          <Ionicons name="time" size={24} color="black" />
          <Text style={styles.labelBold}>Horario de recordatorios:</Text>
        </View>
        <TextInput style={styles.input} value={task.reminderTime} editable={false} />
        <View style={styles.row}>
          <Ionicons name="calendar" size={24} color="black" />
          <Text style={styles.labelBold}>Fecha límite:</Text>
        </View>
        <TextInput style={styles.input} value={task.endDate} editable={false} />
        <View style={styles.subtasksContainer}>
          <Text style={styles.subtasksTitle}>Subtareas</Text>
          {task.subtasks.map((subtask, index) => (
            <View key={index} style={styles.subtask}>
              <TouchableOpacity onPress={() => handleSubtaskToggle(index)}>
                <Ionicons
                  name={subtask.completed ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={subtask.completed ? 'green' : 'grey'}
                />
              </TouchableOpacity>
              <Text style={styles.subtaskTitle}>{subtask.title}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleDeletePress}>
          <Ionicons name="trash" size={24} color="black" />
          <Text style={styles.actionText}>Eliminar tarea</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleEditPress}>
          <Ionicons name="create" size={24} color="black" />
          <Text style={styles.actionText}>Editar tarea</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>¿Estás seguro de que deseas eliminar esta tarea?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={confirmDelete}>
                <Text style={styles.modalButtonText}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  type: {
    fontSize: 18,
    color: '#4A4A4A',
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginHorizontal: 8,
  },
  progress: {
    height: 10,
    backgroundColor: '#FFD700',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#4A4A4A',
    marginBottom: 16,
  },
  inlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  labelBold: {
    fontSize: 14,
    color: '#4A4A4A',
    fontWeight: 'bold',
  },
  category: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  priority: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  membersContainer: {
    marginBottom: 16,
  },
  membersTitle: {
    fontSize: 16,
    color: '#4A4A4A',
    marginBottom: 8,
  },
  member: {
    fontSize: 14,
    color: '#4A4A4A',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#4A4A4A',
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  subtasksContainer: {
    marginBottom: 16,
  },
  subtasksTitle: {
    fontSize: 16,
    color: '#4A4A4A',
    marginBottom: 8,
  },
  subtask: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtaskTitle: {
    fontSize: 14,
    color: '#4A4A4A',
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#4A4A4A',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: 300,
  },
  modalText: {
    fontSize: 16,
    color: '#4A4A4A',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#2A9D8F',
  },
});

export default TaskDetailScreen;
