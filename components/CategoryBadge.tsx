import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CATEGORIES, getCategoryConfig } from '@/config/config_types';

interface CategoryBadgeProps {
  // Puede recibir tanto categorías de la app como de la API
  category: string;
  size?: 'small' | 'medium' | 'large';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  category, 
  size = 'medium' 
}) => {
  // Mapea automáticamente si es una categoría de la API
  const config = getCategoryConfig(category);
  
  const sizeStyles = {
    small: { width: 32, height: 32, fontSize: 16 },
    medium: { width: 40, height: 40, fontSize: 20 },
    large: { width: 48, height: 48, fontSize: 24 }
  };

  return (
    <View style={[
      styles.badge, 
      { 
        backgroundColor: config.color,
        width: sizeStyles[size].width,
        height: sizeStyles[size].height
      }
    ]}>
      <Text style={[styles.icon, { fontSize: sizeStyles[size].fontSize }]}>
        {config.icon}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  icon: {
    textAlign: 'center',
  }
});