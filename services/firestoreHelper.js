import { db } from './firebaseConfig';
import { getAuth } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

export const saveOnboardingData = async (data) => {
  try {
    const auth = getAuth(); // ✅ Safe for Expo
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('No user logged in');

    const ref = doc(db, 'users', uid);
    await setDoc(ref, {
      ...data,
      createdAt: Timestamp.now(),
    });

    console.log('Saved onboarding data for user:', uid);
    return uid;
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return null;
  }
};