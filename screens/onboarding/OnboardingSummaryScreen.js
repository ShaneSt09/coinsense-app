import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { saveOnboardingData } from '../../services/firestoreHelper'; 

export default function OnboardingSummaryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { income, tracking, goal } = route.params;

  const handleFinish = async () => {
    console.log("Button tapped");
  
    try {
      const result = await saveOnboardingData({ income, tracking, goal });
      console.log("Save result:", result);
  
      if (result) {
        navigation.navigate('Dashboard');
      } else {
        alert('Something went wrong. Try again.');
      }
    } catch (err) {
      console.error("Crash in handleFinish:", err);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Here's your starter plan:</Text>

      <View style={styles.summaryBox}>
        <Text style={styles.label}>Monthly Income:</Text>
        <Text style={styles.value}>${income}</Text>

        <Text style={styles.label}>Spending Habit:</Text>
        <Text style={styles.value}>{tracking}</Text>

        <Text style={styles.label}>Money Goal:</Text>
        <Text style={styles.value}>{goal}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleFinish}>
        <Text style={styles.buttonText}>Let’s Do This</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: '#3CB878',
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  label: {
    fontFamily: 'Poppins_700Bold',
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#3CB878',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
});
