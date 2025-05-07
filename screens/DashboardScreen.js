import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>Good morning, Jordan 👋</Text>
      <Text style={styles.progress}>You’ve saved $120 toward your goal — nice work!</Text>

      {/* Spending Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Spending Summary</Text>
        <Text style={styles.cardText}>This week: $83</Text>
        <Text style={styles.cardText}>Top category: Food & Drinks</Text>
        <Text style={styles.tipText}>AI Tip: You’re spending 25% more on food. Want help?</Text>
      </View>

      {/* Savings Goal */}
      <View style={[styles.card, styles.goalCard]}>
        <Text style={styles.cardTitle}>Emergency Fund</Text>
        <Text style={styles.cardText}>Goal: $1,000</Text>
        <Text style={styles.cardText}>Saved: $120</Text>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>View progress</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Tip */}
      <View style={[styles.card, styles.tipCard]}>
        <Text style={styles.cardTitle}>Daily CoinTip</Text>
        <Text style={styles.cardText}>
          “Try the 24-hour rule before any impulse buy. Still want it tomorrow? Go for it.”
        </Text>
      </View>

      {/* Learn Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Learn & Grow</Text>
        <Text style={styles.linkText}>• What’s the difference between saving and investing?</Text>
        <Text style={styles.linkText}>• How do I start investing with $100?</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  greeting: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: '#3CB878',
    marginBottom: 5,
  },
  progress: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#555',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#ccc',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#333',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#444',
    marginBottom: 5,
  },
  tipText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#888',
    marginTop: 10,
  },
  goalCard: {
    backgroundColor: '#E6F8F1',
  },
  tipCard: {
    backgroundColor: '#FFF3CD',
  },
  linkButton: {
    marginTop: 10,
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    color: '#3CB878',
  },
});
