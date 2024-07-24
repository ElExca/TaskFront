import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const translateY = useSharedValue(-50);
  const navigation = useNavigation();

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
          const response = await fetch('https://your-backend-url.com/notifications', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwtToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setNotifications(data.notifications); // Asegúrate de que data.notifications contiene id y text
          } else {
            console.error('Error al obtener notificaciones');
          }
        }
      } catch (error) {
        console.error('Error al recuperar el token', error);
      }
    }
  };

  const renderNotificationItem = ({ item }: { item: any }) => (
    <View key={item.id} style={styles.notificationItem}>
      <Text style={styles.notificationText}>{item.text}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('TaskDetail', { id: item.id })}>
        <Text style={styles.detailsText}>Ver detalles</Text>
      </TouchableOpacity>
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
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderNotificationItem}
          />
        </View>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  notificationText: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  detailsText: {
    fontSize: 14,
    color: '#2A9D8F',
  },
});

export default Header;
