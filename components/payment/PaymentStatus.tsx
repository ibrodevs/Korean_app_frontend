import React, { useState, useEffect } from 'react';
import {
  View,
  
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import Text from '../../components/Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PaymentStatus as PaymentStatusType } from '../../types/payment';

interface PaymentStatusProps {
  status: PaymentStatusType;
  onComplete?: () => void;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ status, onComplete }) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  const [progressAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Анимация прогресса
    Animated.timing(progressAnim, {
      toValue: status.progress,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Пульсирующая анимация для обработки
    if (status.status === 'processing') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // При завершении вызываем callback
    if (status.status === 'completed' && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const getStatusIcon = () => {
    switch (status.status) {
      case 'pending':
        return 'time-outline';
      case 'processing':
        return 'sync-outline';
      case 'completed':
        return 'checkmark-circle-outline';
      case 'failed':
        return 'close-circle-outline';
      case 'cancelled':
        return 'ban-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'pending':
        return theme.textSecondary;
      case 'processing':
        return theme.primary;
      case 'completed':
        return theme.secondary;
      case 'failed':
        return theme.error;
      case 'cancelled':
        return theme.textSecondary;
      default:
        return theme.text;
    }
  };

  const getStatusMessage = () => {
    if (status.message) return status.message;
    
    const messages: Record<string, string> = {
      'pending': t('payment.processing'),
      'processing': t('payment.verification'),
      'completed': t('payment.success'),
      'failed': t('payment.failed'),
      'cancelled': t('status.cancelled'),
    };
    return messages[status.status] || status.message;
  };

  return (
    <View style={styles.container}>
      {/* Анимированный круг */}
      <Animated.View
        style={[
          styles.circle,
          {
            borderColor: getStatusColor(),
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Ionicons
          name={getStatusIcon() as any}
          size={48}
          color={getStatusColor()}
        />
      </Animated.View>

      {/* Статус */}
      <Text style={[styles.statusText, { color: theme.heading }]}>
        {t(`status.${status.status}`)}
      </Text>

      {/* Сообщение */}
      <Text style={[styles.message, { color: theme.text }]}>
        {getStatusMessage()}
      </Text>

      {/* Прогресс бар */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBackground, { backgroundColor: theme.border }]}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: getStatusColor(),
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.textSecondary }]}>
          {status.progress}%
        </Text>
      </View>

      {/* Оставшееся время (если есть) */}
      {status.estimatedTime && (
        <Text style={[styles.timeEstimate, { color: theme.textSecondary }]}>
          {t('payment.processingTime')}
        </Text>
      )}

      {/* Дополнительная информация */}
      <View style={styles.infoContainer}>
        <Ionicons name="information-circle-outline" size={20} color={theme.textSecondary} />
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          {t('payment.securePayment')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 40,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 16,
  },
  progressBackground: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  timeEstimate: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 6,
  },
});

export default PaymentStatus;