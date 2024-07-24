import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

interface PerformanceChartProps {
  completed: number;
  inProgress: number;
  notStarted: number;
}

const screenWidth = Dimensions.get('window').width;
const radius = 70;
const circumference = 2 * Math.PI * radius;

const PerformanceChart: React.FC<PerformanceChartProps> = ({ completed, inProgress, notStarted }) => {
  const totalTasks = completed + inProgress + notStarted;
  const completedPercentage = (completed / totalTasks) * 100;
  const inProgressPercentage = (inProgress / totalTasks) * 100;
  const notStartedPercentage = (notStarted / totalTasks) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cómo va tu desempeño?</Text>
      <Svg width={screenWidth - 32} height={200} viewBox="0 0 200 200">
        <G rotation="-90" origin="100, 100">
          <Circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#6BCB77"
            strokeWidth="30"
            strokeDasharray={`${(circumference * completedPercentage) / 100}, ${circumference}`}
            fill="none"
          />
          <Circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#FFD700"
            strokeWidth="30"
            strokeDasharray={`${(circumference * inProgressPercentage) / 100}, ${circumference}`}
            fill="none"
            strokeDashoffset={-(circumference * completedPercentage) / 100}
          />
          <Circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#FF6B6B"
            strokeWidth="30"
            strokeDasharray={`${(circumference * notStartedPercentage) / 100}, ${circumference}`}
            fill="none"
            strokeDashoffset={-((circumference * (completedPercentage + inProgressPercentage)) / 100)}
          />
        </G>
        <Text style={styles.totalTasks}>{totalTasks}</Text>
      </Svg>
      <View style={styles.statsContainer}>
        <View style={[styles.statsBox, { backgroundColor: '#6BCB77' }]}>
          <Text style={styles.statsText}>{completed} Tareas completadas</Text>
        </View>
        <View style={[styles.statsBox, { backgroundColor: '#FFD700' }]}>
          <Text style={styles.statsText}>{inProgress} Tareas en proceso</Text>
        </View>
        <View style={[styles.statsBox, { backgroundColor: '#FF6B6B' }]}>
          <Text style={styles.statsText}>{notStarted} Tareas sin iniciar</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 16,
  },
  totalTasks: {
    position: 'absolute',
    top: 85,
    left: (screenWidth - 32) / 2 - 50,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  statsBox: {
    flex: 1,
    marginHorizontal: 4,
    padding: 8,
    borderRadius: 8,
  },
  statsText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PerformanceChart;
