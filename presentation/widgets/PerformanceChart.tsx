import React from 'react';
import { View, Text as RNText, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, G, Text as SvgText, TSpan } from 'react-native-svg';


interface PerformanceChartProps {
  completed: number;
  inProgress: number;
  notStarted: number;
  totalTasks: number;
}

const screenWidth = Dimensions.get('window').width;
const radius = 70;
const circumference = 2 * Math.PI * radius;

const PerformanceChart: React.FC<PerformanceChartProps> = ({ completed, inProgress, notStarted, totalTasks }) => {
  const completedPercentage = (completed / totalTasks) * 100;
  const inProgressPercentage = (inProgress / totalTasks) * 100;
  const notStartedPercentage = (notStarted / totalTasks) * 100;

  return (
    <View style={styles.container}>
      <RNText style={styles.title}>¿Cómo va tu desempeño?</RNText>
      <Svg width={200} height={200} viewBox="0 0 200 200">
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
        <SvgText
        x="100"
        y="70"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="20"
        fill="#000"
        fontWeight="500"
      >
        <TSpan x="100" dy="1.2em">Tus tareas</TSpan>
      </SvgText>
      
      <SvgText
        x="100"
        y="93"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="20"
        fill="#000"
        fontWeight="bold"
      >
        <TSpan x="100" dy="1.2em">{totalTasks}</TSpan>
      </SvgText>
      </Svg>
      <View style={styles.statsContainer}>
        <View style={[styles.statsBox, { backgroundColor: '#6BCB77' }]}>
          <RNText style={styles.statsText}>{completed} Tareas completadas</RNText>
        </View>
        <View style={[styles.statsBox, { backgroundColor: '#FFD700' }]}>
          <RNText style={styles.statsText}>{inProgress} Tareas en proceso</RNText>
        </View>
        <View style={[styles.statsBox, { backgroundColor: '#FF6B6B' }]}>
          <RNText style={styles.statsText}>{notStarted} Tareas sin iniciar</RNText>
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
