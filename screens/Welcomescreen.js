import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { getAuth, signInAnonymously } from 'firebase/auth';
import { app } from '../services/firebaseConfig';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  const handleContinue = async () => {
    try {
      const auth = getAuth(app);
      await signInAnonymously(auth);
      navigation.replace('Income'); // triggers onboarding flow
    } catch (err) {
      console.error('Anon login failed:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to CoinSense</Text>
      <Text style={styles.subtitle}>
        Make sense of your cents. Track spending, save smart, and learn money moves—all in one app.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: '#3CB878',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#3CB878',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
});
