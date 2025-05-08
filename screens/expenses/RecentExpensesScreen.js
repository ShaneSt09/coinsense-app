import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Alert,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
} from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Swipeable } from 'react-native-gesture-handler';

export default function RecentExpensesScreen() {
    const [expenses, setExpenses] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchExpenses = async () => {
        try {
            const uid = getAuth().currentUser?.uid;
            const q = query(
                collection(db, 'users', uid, 'expenses'),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            const items = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setExpenses(items);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleDelete = async (id) => {
        try {
            const uid = getAuth().currentUser?.uid;
            await deleteDoc(doc(db, 'users', uid, 'expenses', id));
            setExpenses((prev) => prev.filter((e) => e.id !== id));
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const confirmDelete = (id) => {
        Alert.alert(
            'Delete Expense',
            'Are you sure you want to delete this expense?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => handleDelete(id) },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <Swipeable
            renderRightActions={() => (
                <View style={styles.deleteWrapper}>
                    <Text style={styles.deleteText}>Delete</Text>
                </View>
            )}
            onSwipeableRightOpen={() => confirmDelete(item.id)}
        >
            <View style={styles.item}>
                <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.description}>
                    {item.description || 'No description'}
                </Text>
            </View>
        </Swipeable>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>All Expenses</Text>
                <FlatList
                    data={expenses}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={fetchExpenses} />
                    }
                    ListEmptyComponent={
                        <Text style={styles.empty}>No expenses yet</Text>
                    }
                />
            </View>
        </GestureHandlerRootView>
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
        marginBottom: 20,
    },
    item: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 12,
    },
    amount: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
        color: '#333',
    },
    category: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#3CB878',
    },
    description: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: '#666',
    },
    deleteWrapper: {
        backgroundColor: '#FF4D4D',
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: 20,
        borderRadius: 12,
        marginBottom: 12,
    },
    deleteText: {
        color: '#fff',
        fontFamily: 'Poppins_700Bold',
    },
    empty: {
        textAlign: 'center',
        fontFamily: 'Poppins_400Regular',
        color: '#999',
        marginTop: 20,
    },
});
