import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Notification {
  _id: string;
  message: string;
  task_id: string;
  user_id: string;
}

type RootStackParamList = {
  taskDetail: { taskId: string };
};

const Header: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const translateY = useSharedValue(-50);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 500 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleNotifications = async () => {
    setNotificationsVisible(!notificationsVisible);
    if (!notificationsVisible) {
      try {
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        if (jwtToken) {
          const response = await fetch('http://18.211.141.106:5003/notifications', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Received notifications:', data);
            if (Array.isArray(data)) {
              setNotifications(data);
            } else {
              console.error('Unexpected data format:', data);
              setNotifications([]);
            }
          } else {
            console.error('Error al obtener notificaciones');
            setNotifications([]);
          }
        }
      } catch (error) {
        console.error('Error al recuperar el token', error);
        setNotifications([]);
      }
    }
  };

  const handleTaskPress = async (taskId: string) => {
    console.log('Navigating to taskDetail with taskId:', taskId);
    try {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      if (jwtToken) {
        const response = await fetch(`http://18.211.141.106:5003/task/${taskId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
          },
        });

        console.log('Task fetch response status:', response.status);

        if (response.ok) {
          const taskData = await response.json();
          console.log('Task data:', taskData);

          if (taskData && Object.keys(taskData).length > 0) {
            navigation.navigate('taskDetail', { taskId });
          } else {
            setModalMessage('La tarea no existe.');
            setModalVisible(true);
          }
        } else {
          setModalMessage('La tarea no existe.');
          setModalVisible(true);
        }
      }
    } catch (error) {
      console.error('Error al verificar la tarea', error);
      setModalMessage('Error al verificar la tarea.');
      setModalVisible(true);
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <View key={item._id} style={styles.notificationItem}>
      <Text style={styles.notificationText}>{item.message}</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}></View>
        </View>
        {item.task_id !== "0000000" && (
          <TouchableOpacity onPress={() => handleTaskPress(item.task_id)}>
            <Text style={styles.detailsText}>Ver detalles</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View>
      <Animated.View style={[styles.header, animatedStyle]}>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleNotifications}>
          <Ionicons name="notifications" size={24} color="black" />
        </TouchableOpacity>
      </Animated.View>
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="list" size={24} color="#4A4A4A" />
            <Text style={styles.menuItemText}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="log-out" size={24} color="#4A4A4A" />
            <Text style={styles.menuItemText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      )}
      {notificationsVisible && (
        <View style={styles.notifications}>
          <Text style={styles.notificationsTitle}>Recordatorios</Text>
          <FlatList
            data={notifications}
            keyExtractor={(item) => item._id}
            renderItem={renderNotificationItem}
            ListEmptyComponent={<Text>No hay notificaciones</Text>}
          />
        </View>
      )}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  menu: {
    backgroundColor: 'white',
    padding: 16,
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4A4A4A',
  },
  notifications: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    position: 'absolute',
    top: 60,
    right: 10,
    left: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1,
  },
  notificationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notificationItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  notificationText: {
    fontSize: 14,
    color: '#4A4A4A',
    marginBottom: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#EEE',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressBar: {
    height: '100%',
    width: '60%', // Ejemplo, ajusta esto según el progreso real
    backgroundColor: '#F4EB70', // Cambia el color según el estado de la tarea
  },
  detailsText: {
    fontSize: 14,
    color: '#2A9D8F',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: 300,
  },
  modalText: {
    fontSize: 16,
    color: '#4A4A4A',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#2A9D8F',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Header;
