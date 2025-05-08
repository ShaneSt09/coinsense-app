import { db } from './firebaseConfig';
import { getAuth } from 'firebase/auth';
import { collection, doc, setDoc, addDoc, Timestamp } from 'firebase/firestore';

export const saveOnboardingData = async (data) => {
    try {
      const auth = getAuth();
      const waitForUser = () =>
        new Promise((resolve, reject) => {
          const check = () => {
            const uid = auth.currentUser?.uid;
            if (uid) resolve(uid);
            else setTimeout(check, 200); // Retry every 200ms
          };
          check();
        });
  
      const uid = await waitForUser(); // ✅ ensures we have UID
  
      const ref = doc(db, 'users', uid);
      await setDoc(ref, {
        ...data,
        createdAt: Timestamp.now(),
        onboarded: true,
      });
  
      console.log('Saved onboarding data for user:', uid);
      return uid;
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      return null;
    }
  };

export const saveExpense = async ({ amount, description, category }) => {
    try {
      const auth = getAuth();
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('User not logged in');
  
      const ref = collection(db, 'users', uid, 'expenses');
      await addDoc(ref, {
        amount: parseFloat(amount),
        description: description || '',
        category,
        createdAt: Timestamp.now(),
        onboarded: true,
      });
  
      console.log('Expense saved for user:', uid);
      return true;
    } catch (err) {
      console.error('Error saving expense:', err);
      return false;
    }
  };