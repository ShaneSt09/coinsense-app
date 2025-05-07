import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function OnboardingCustomGoalScreen() {
  const [customGoal, setCustomGoal] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { income, tracking } = route.params;

  const handleNext = () => {
    if (customGoal.trim()) {
      navigation.navigate('Summary', {
        income,
        tracking,
        goal: customGoal,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's one thing you're saving for?</Text>
      <Text style={styles.subtitle}>Big or small — your goal matters.</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g., Trip to St. Lucia"
        value={customGoal}
        onChangeText={setCustomGoal}
      />

      <TouchableOpacity
        style={[styles.button, !customGoal && styles.disabledButton]}
        onPress={handleNext}
        disabled={!customGoal}
      >
        <Text style={styles.buttonText}>Next</Text>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#555',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 30,
    backgroundColor: '#fff',
    fontFamily: 'Poppins_400Regular',
  },
  button: {
    backgroundColor: '#3CB878',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9ED9C3',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
});
