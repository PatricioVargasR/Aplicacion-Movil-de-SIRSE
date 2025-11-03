import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function ContactScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contacto</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Contáctanos</Text>
        <Text style={styles.description}>
          Para reportes de emergencia o consultas, comunícate con nosotros.
        </Text>

        <View style={styles.contactCard}>
          <Text style={styles.contactIcon}>📞</Text>
          <Text style={styles.contactLabel}>Teléfono</Text>
          <Text style={styles.contactValue}>911</Text>
        </View>

        <View style={styles.contactCard}>
          <Text style={styles.contactIcon}>✉️</Text>
          <Text style={styles.contactLabel}>Email</Text>
          <Text style={styles.contactValue}>contacto@sirse.gob.mx</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    fontSize: 28,
    color: '#FFF',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 32,
    lineHeight: 24,
  },
  contactCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  contactIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  contactValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2196F3',
  },
});