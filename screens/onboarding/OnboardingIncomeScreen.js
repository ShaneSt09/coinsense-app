import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function OnboardingIncomeScreen() {
  const [income, setIncome] = useState('');
  const navigation = useNavigation();

  const handleNext = () => {
    if (income.trim()) {
      navigation.navigate('Tracking', { income });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What’s your monthly income?</Text>
      <Text style={styles.subtitle}>After tax is fine. A rough estimate works too.</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="$2000"
        value={income}
        onChangeText={setIncome}
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
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
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
});
