import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function OnboardingTrackingScreen() {
  const [selectedOption, setSelectedOption] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { income } = route.params;

  const handleNext = () => {
    if (selectedOption) {
      navigation.navigate('Goal', { income, tracking: selectedOption });
    }
  };

  const options = [
    'Yes, manually',
    'Yes, using an app',
    'No, but I want to start',
    'Not really',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Do you currently track your spending?</Text>

      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.option,
            selectedOption === option && styles.selectedOption,
          ]}
          onPress={() => setSelectedOption(option)}
        >
          <Text
            style={[
              styles.optionText,
              selectedOption === option && styles.selectedText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.button, !selectedOption && styles.disabledButton]}
        onPress={handleNext}
        disabled={!selectedOption}
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
    marginBottom: 20,
  },
  option: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  selectedOption: {
    borderColor: '#3CB878',
    backgroundColor: '#E6F8F1',
  },
  optionText: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
  },
  selectedText: {
    color: '#3CB878',
    fontFamily: 'Poppins_700Bold',
  },
  button: {
    backgroundColor: '#3CB878',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
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
