import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = () => {
    // Manejar el registro del usuario
    console.log({ name, email, password, confirmPassword });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo.png')} // Asegúrate de tener esta imagen en tu carpeta de assets
        style={styles.logo}
      />
      <Text style={styles.title}>Crea una cuenta</Text>
      <Text style={styles.subtitle}>Comienza con esta experiencia hoy</Text>

      <View style={styles.form}>
        <Text>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Paola Penagos"
          value={name}
          onChangeText={setName}
        />
        <Text>Correo</Text>
        <TextInput
          style={styles.input}
          placeholder="email@ejemplo.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Text>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="contraseña123"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Text>Confirmar contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="contraseña123"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>CREAR CUENTA</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/login')} style={styles.loginLink}>
          <Text>¿Ya tienes una cuenta? <Text style={styles.loginLinkText}>Inicia sesión</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  logo: {
    width: 150,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  form: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#87E2D0',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#417067',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
