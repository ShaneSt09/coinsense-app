import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { saveExpense } from '../../services/firestoreHelper'


export default function AddExpenseScreen({ navigation }) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Food');

    const handleAdd = async () => {
        if (!amount) {
            Alert.alert('Missing Info', 'Please enter an amount.');
            return;
        }

        const success = await saveExpense({ amount, description, category });

        if (success) {
            Alert.alert('Success', 'Expense saved!');
            setAmount('');
            setDescription('');
            setCategory('Food');
            navigation.goBack(); // or stay if you want
        } else {
            Alert.alert('Error', 'Could not save expense.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Add New Expense</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Amount"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Description (optional)"
                        placeholderTextColor="#999"
                        value={description}
                        onChangeText={setDescription}
                    />

                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={category}
                            onValueChange={(value) => setCategory(value)}
                        >
                            <Picker.Item label="Food" value="Food" />
                            <Picker.Item label="Transport" value="Transport" />
                            <Picker.Item label="Bills" value="Bills" />
                            <Picker.Item label="Shopping" value="Shopping" />
                            <Picker.Item label="Other" value="Other" />
                        </Picker>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleAdd}>
                        <Text style={styles.buttonText}>Add Expense</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        paddingHorizontal: 30,
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        color: '#3CB878',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 14,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontFamily: 'Poppins_400Regular',
        fontSize: 15,
        color: '#333',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
        overflow: 'hidden',
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
