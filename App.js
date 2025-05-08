import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { app, db } from './services/firebaseConfig';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// screens
import WelcomeScreen from './screens/WelcomeScreen';
import DashboardScreen from './screens/DashboardScreen';
import OnboardingIncomeScreen from './screens/onboarding/OnboardingIncomeScreen';
import OnboardingTrackingScreen from './screens/onboarding/OnboardingTrackingScreen';
import OnboardingGoalScreen from './screens/onboarding/OnboardingGoalScreen';
import OnboardingCustomGoalScreen from './screens/onboarding/OnboardingCustomGoalScreen';
import OnboardingSummaryScreen from './screens/onboarding/OnboardingSummaryScreen';
import AddExpenseScreen from './screens/expenses/AddExpenseScreen';
import ExpenseListScreen from './screens/expenses/ExpenseListScreen';
import RecentExpensesScreen from './screens/expenses/RecentExpensesScreen';

import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const [initialScreen, setInitialScreen] = useState(null);

	useEffect(() => {
		const auth = getAuth(app);
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				const uid = user.uid;
				const docSnap = await getDoc(doc(db, 'users', uid));
				if (docSnap.exists() && docSnap.data().onboarded) {
					setInitialScreen('Dashboard');
				} else {
					setInitialScreen('Income');
				}
			} else {
				setInitialScreen('Welcome'); // 👈 show this if no user exists yet
			}
		});
	
		return () => unsubscribe();
	}, []);

  if (!fontsLoaded || !initialScreen) return <AppLoading />;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialScreen}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Income" component={OnboardingIncomeScreen} />
        <Stack.Screen name="Tracking" component={OnboardingTrackingScreen} />
        <Stack.Screen name="Goal" component={OnboardingGoalScreen} />
        <Stack.Screen name="CustomGoal" component={OnboardingCustomGoalScreen} />
        <Stack.Screen name="Summary" component={OnboardingSummaryScreen} />
        <Stack.Screen
					name="Dashboard"
					component={DashboardScreen}
					options={{ gestureEnabled: false }}
				/>

        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
        <Stack.Screen name="ExpenseList" component={ExpenseListScreen} />
        <Stack.Screen name="RecentExpenses" component={RecentExpensesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
