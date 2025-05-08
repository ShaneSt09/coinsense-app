import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../../services/firebaseConfig';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

export default function ExpenseListScreen() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const auth = getAuth();
      const uid = auth.currentUser?.uid;
      const ref = collection(db, 'users', uid, 'expenses');
      const q = query(ref, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setExpenses(data);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
      <Text style={styles.category}>{item.category}</Text>
      {item.description ? (
        <Text style={styles.desc}>{item.description}</Text>
      ) : null}
      <Text style={styles.date}>
        {item.createdAt?.toDate?.().toLocaleDateString() || 'Unknown date'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Expenses</Text>
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3CB878" />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#3CB878',
    marginBottom: 5,
  },
  total: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 20,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  amount: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#333',
  },
  category: {
    fontFamily: 'Poppins_400Regular',
    color: '#3CB878',
    marginBottom: 4,
  },
  desc: {
    fontFamily: 'Poppins_400Regular',
    color: '#555',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#999',
  },
});
