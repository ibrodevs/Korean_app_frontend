import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import Text from '../Text';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

interface EmptyOrdersProps {
  onStartShopping: () => void;
}

const { width } = Dimensions.get('window');

const EmptyOrders: React.FC<EmptyOrdersProps> = ({ onStartShopping }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* Декоративные элементы фона */}
      <View style={[styles.decorativeCircle1, { backgroundColor: `${theme.primary}15` }]} />
      <View style={[styles.decorativeCircle2, { backgroundColor: `${theme.primary}10` }]} />
      
      {/* Основной контент */}
      <View style={styles.content}>
        {/* Иконка в стилизованном контейнере */}
        <LinearGradient
          colors={[`${theme.primary}20`, `${theme.primary}05`]}
          style={[
            styles.iconContainer,
            { borderColor: `${theme.primary}30` }
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.icon, { color: theme.primary }]}>
            📦
          </Text>
          <View style={[styles.iconBadge, { backgroundColor: theme.primary }]} />
        </LinearGradient>
        
        {/* Заголовок */}
        <Text style={[styles.title, { color: theme.heading }]}>
          {t('orders.emptyTitle')}
        </Text>
        
        {/* Описание */}
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {t('orders.emptyDescription')}
        </Text>

        {/* Кнопка с градиентом */}
        <TouchableOpacity
          onPress={onStartShopping}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[theme.primary, `${theme.primary}DD`]}
            style={[styles.button]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
              {t('orders.startShopping')}
            </Text>
            <Text style={[styles.buttonIcon, { color: '#FFFFFF' }]}>
              →
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Дополнительная подсказка */}
        <Text style={[styles.hint, { color: `${theme.textSecondary}80` }]}>
          {t('orders.emptyHint')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    top: -width * 0.2,
    right: -width * 0.3,
    opacity: 0.3,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    bottom: -width * 0.2,
    left: -width * 0.3,
    opacity: 0.2,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400,
    padding: 32,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1.5,
    position: 'relative',
  },
  icon: {
    fontSize: 56,
  },
  iconBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    opacity: 0.8,
    fontWeight: '400',
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 24,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
    marginTop: 2,
  },
  hint: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
});

export default EmptyOrders;