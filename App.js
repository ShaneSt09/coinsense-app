import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { app } from './services/firebaseConfig';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from 'firebase/auth';

// screens
import WelcomeScreen from './screens/WelcomeScreen';
import DashboardScreen from './screens/DashboardScreen';
import OnboardingIncomeScreen from './screens/onboarding/OnboardingIncomeScreen';
import OnboardingTrackingScreen from './screens/onboarding/OnboardingTrackingScreen';
import OnboardingGoalScreen from './screens/onboarding/OnboardingGoalScreen';
import OnboardingCustomGoalScreen from './screens/onboarding/OnboardingCustomGoalScreen';
import OnboardingSummaryScreen from './screens/onboarding/OnboardingSummaryScreen';

import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

	const [userReady, setUserReady] = useState(false);

	useEffect(() => {
		const auth = getAuth(app);
	
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (!user) await signInAnonymously(auth);
			setUserReady(true);
		});
	
		return () => unsubscribe();
	}, []);

  if (!fontsLoaded || !userReady) return <AppLoading />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Income" component={OnboardingIncomeScreen} />
        <Stack.Screen name="Tracking" component={OnboardingTrackingScreen} />
        <Stack.Screen name="Goal" component={OnboardingGoalScreen} />
        <Stack.Screen name="CustomGoal" component={OnboardingCustomGoalScreen} />
        <Stack.Screen name="Summary" component={OnboardingSummaryScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
