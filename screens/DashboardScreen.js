import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../services/firebaseConfig';
import {
    collection,
    query,
    orderBy,
    getDocs,
    getDoc,
    doc,
} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

export default function DashboardScreen() {
    const [expenses, setExpenses] = useState([]);
    const [userGoal, setUserGoal] = useState('');
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const chartColors = [
        '#3CB878', '#FFA07A', '#FFB347', '#87CEFA',
        '#DA70D6', '#FFD700', '#00CED1', '#FA8072',
    ];
    const getCategoryColor = (category) => {
        const keys = Object.keys(categoryTotals);
        const index = keys.indexOf(category);
        return chartColors[index % chartColors.length];
    };
    const fetchDashboardData = async () => {
        try {
            const auth = getAuth();
            const uid = auth.currentUser?.uid;

            const ref = collection(db, 'users', uid, 'expenses');
            const q = query(ref, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setExpenses(data);

            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                setUserGoal(userDoc.data()?.goal || '');
            }
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchDashboardData);
        return unsubscribe;
    }, [navigation]);

    const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    const categoryTotals = expenses.reduce((acc, e) => {
        const cat = e.category || 'Other';
        acc[cat] = (acc[cat] || 0) + e.amount;
        return acc;
    }, {});

    const renderExpense = ({ item }) => (
        <View style={styles.expenseItem}>
            <Text style={styles.expenseText}>${item.amount.toFixed(2)}</Text>
            <Text style={styles.expenseSub}>{item.category}</Text>
            <Text style={styles.expenseNote}>
                {item.description || 'No description'}
            </Text>
        </View>
    );

    const renderGoalTip = () => {
        if (!userGoal) return null;

        let tip = '';
        if (userGoal === 'Build a savings habit') tip = 'Try setting aside $100 this month.';
        else if (userGoal === 'Control my spending') tip = 'Review your biggest categories below.';
        else if (userGoal === 'Start learning to invest') tip = 'Once you’ve saved $500, we’ll guide you forward.';
        else if (userGoal === 'All of the above') tip = 'You’re on track. Balance is key!';
        else tip = 'Keep tracking. Specific goals need consistent steps.';

        return (
            <View style={styles.goalBox}>
                <Text style={styles.goalTitle}>Your Goal:</Text>
                <Text style={styles.goalText}>{userGoal}</Text>
                <Text style={styles.tipText}>{tip}</Text>
            </View>
        );
    };

    return (
        <>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.header}>Welcome back 👋</Text>
                    <Text style={styles.subheader}>Total Spent This Month</Text>
                    <Text style={styles.bigTotal}>${total.toFixed(2)}</Text>

                    {renderGoalTip()}
                    {Object.keys(categoryTotals).length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Spending Breakdown</Text>
                            <PieChart
                                data={Object.entries(categoryTotals).map(([key, value], index) => ({
                                    name: key,
                                    amount: value,
                                    color: chartColors[index % chartColors.length],
                                    legendFontColor: '#333',
                                    legendFontSize: 13,
                                }))}
                                width={Dimensions.get('window').width - 40}
                                height={190}
                                chartConfig={{
                                    color: () => `#3CB878`,
                                }}
                                accessor="amount"
                                backgroundColor="transparent"
                                paddingLeft="0"
                                absolute
                                style={{ marginBottom: 20 }}
                            />
                        </>
                    )}

                    {loading ? (
                        <ActivityIndicator size="large" color="#3CB878" />
                    ) : (
                        <View contentContainerStyle={{ paddingBottom: 20 }}>
                            {Object.entries(categoryTotals).map(([cat, value]) => (
                                <View key={cat} style={styles.catBar}>
                                    <Text style={styles.catLabel}>{cat}</Text>
                                    <View style={styles.barBackground}>
                                        <View
                                            style={[
                                                styles.barFill,
                                                {
                                                    width: `${(value / total) * 100 || 0}%`,
                                                    backgroundColor: getCategoryColor(cat),
                                                },
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.catAmount}>${value.toFixed(2)}</Text>
                                </View>
                            ))}

                            <Text style={styles.sectionTitle}>Recent Expenses</Text>

                            {expenses.length === 0 ? (
                                <Text style={{ fontFamily: 'Poppins_400Regular', color: '#999' }}>
                                    No expenses yet
                                </Text>
                            ) : (
                                <>
                                    {expenses.slice(0, 2).map((item) => (
                                        <View key={item.id} style={styles.expenseItem}>
                                            <Text style={styles.expenseText}>${item.amount.toFixed(2)}</Text>
                                            <Text style={styles.expenseSub}>{item.category}</Text>
                                            <Text style={styles.expenseNote}>{item.description || 'No description'}</Text>
                                        </View>
                                    ))}

                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('RecentExpenses')}
                                        style={styles.viewAllButton}
                                    >
                                        <Text style={styles.viewAllText}>View All Expenses</Text>
                                    </TouchableOpacity>

                                </>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView >
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddExpense')}
            >
                <Text style={styles.fabText}>＋</Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#3CB878',
    },
    subheader: {
        fontFamily: 'Poppins_400Regular',
        color: '#666',
        marginTop: 6,
    },
    bigTotal: {
        fontSize: 32,
        fontFamily: 'Poppins_700Bold',
        marginVertical: 12,
        color: '#333',
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Poppins_700Bold',
        marginTop: 20,
        marginBottom: 8,
    },
    catBar: {
        marginBottom: 10,
    },
    catLabel: {
        fontFamily: 'Poppins_400Regular',
        marginBottom: 4,
    },
    barBackground: {
        backgroundColor: '#e0e0e0',
        height: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    barFill: {
        backgroundColor: '#3CB878',
        height: 10,
    },
    catAmount: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: '#555',
        marginTop: 2,
    },
    expenseItem: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    expenseText: {
        fontFamily: 'Poppins_700Bold',
        color: '#333',
    },
    expenseSub: {
        fontFamily: 'Poppins_400Regular',
        color: '#3CB878',
        fontSize: 12,
    },
    expenseNote: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: '#777',
    },
    goalBox: {
        backgroundColor: '#E6F8F1',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    goalTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
        color: '#3CB878',
        marginBottom: 4,
    },
    goalText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: '#333',
    },
    tipText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 13,
        color: '#555',
        marginTop: 6,
    },
    fab: {
        backgroundColor: '#3CB878',
        position: 'absolute',
        bottom: 30,
        right: 30,
        borderRadius: 30,
        padding: 16,
        elevation: 5,
    },
    fabText: {
        fontSize: 28,
        color: '#fff',
        lineHeight: 30,
    },
    viewAllButton: {
        backgroundColor: '#3CB878',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignSelf: 'center',
        marginTop: 10,
    },
    viewAllText: {
        color: '#fff',
        fontFamily: 'Poppins_700Bold',
        fontSize: 14,
    },
});
