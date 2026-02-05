import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Text from '../../components/Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PaymentStatus as PaymentStatusType } from '../../types/payment';
import LottieView from 'lottie-react-native';
import * as Progress from 'react-native-progress';

const { width } = Dimensions.get('window');

interface PaymentStatusProps {
  status: PaymentStatusType;
  onComplete?: () => void;
  onRetry?: () => void;
  compact?: boolean;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ 
  status, 
  onComplete, 
  onRetry,
  compact = false 
}) => {
  const tailwind = useTailwind();
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  const [progressAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0));
  const [confettiAnim] = useState(new Animated.Value(0));
  
  const circleScale = useRef(new Animated.Value(0.8)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    // Анимация входа
    Animated.parallel([
      Animated.spring(circleScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(iconOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 800,
        delay: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Анимация прогресса
    Animated.timing(progressAnim, {
      toValue: status.progress / 100,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Пульсирующая анимация для обработки
    if (status.status === 'processing') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Свечение для обработки
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // Анимация успешного завершения
    if (status.status === 'completed') {
      // Запускаем конфетти
      Animated.spring(confettiAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Запускаем Lottie анимацию
      if (lottieRef.current) {
        lottieRef.current.play();
      }

      // Плавное свечение
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        { iterations: 2 }
      ).start();

      // При завершении вызываем callback
      if (onComplete) {
        const timer = setTimeout(() => {
          onComplete();
        }, 3000);
        return () => clearTimeout(timer);
      }
    }

    // Анимация ошибки
    if (status.status === 'failed') {
      Animated.sequence([
        Animated.timing(circleScale, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(circleScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [status]);

  const getStatusConfig = () => {
    const configs = {
      pending: {
        icon: 'time-outline',
        primaryColor: theme.textSecondary,
        secondaryColor: theme.textSecondary + '40',
        lottieSource: null,
        gradient: ['#6B7280', '#9CA3AF'],
      },
      processing: {
        icon: 'sync-outline',
        primaryColor: theme.primary,
        secondaryColor: theme.primary + '40',
        lottieSource: null,
        gradient: ['#3B82F6', '#60A5FA'],
      },
      completed: {
        icon: 'checkmark-circle',
        primaryColor: theme.secondary,
        secondaryColor: theme.secondary + '40',
        lottieSource: require('../../assets/lottie/success.json'),
        gradient: ['#10B981', '#34D399'],
      },
      failed: {
        icon: 'close-circle',
        primaryColor: theme.error,
        secondaryColor: theme.error + '40',
        lottieSource: null,
        gradient: ['#EF4444', '#F87171'],
      },
      cancelled: {
        icon: 'ban-outline',
        primaryColor: theme.textSecondary,
        secondaryColor: theme.textSecondary + '40',
        lottieSource: null,
        gradient: ['#6B7280', '#9CA3AF'],
      },
    };

    return configs[status.status] || {
      icon: 'help-circle-outline',
      primaryColor: theme.text,
      secondaryColor: theme.text + '40',
      lottieSource: null,
      gradient: ['#6B7280', '#9CA3AF'],
    };
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

  const getSubMessage = () => {
    const messages: Record<string, string> = {
      'pending': 'Your payment is being initialized',
      'processing': 'Processing your payment securely',
      'completed': 'Payment completed successfully!',
      'failed': 'We encountered an issue with your payment',
      'cancelled': 'Payment was cancelled',
    };
    return messages[status.status] || '';
  };

  const config = getStatusConfig();
  const isProcessing = status.status === 'processing';
  const isCompleted = status.status === 'completed';
  const isFailed = status.status === 'failed';

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {/* Конфетти эффект для успешного платежа */}
      {isCompleted && (
        <Animated.View 
          style={[
            styles.confettiOverlay,
            {
              opacity: confettiAnim,
              transform: [{ scale: confettiAnim }],
            },
          ]}
        >
          <LottieView
            ref={lottieRef}
            source={require('../../assets/lottie/confetti.json')}
            autoPlay={false}
            loop={false}
            style={styles.confetti}
          />
        </Animated.View>
      )}

      {/* Анимированный круг со свечением */}
      <View style={styles.circleWrapper}>
        {/* Внешнее свечение */}
        <Animated.View
          style={[
            styles.glow,
            {
              backgroundColor: config.primaryColor + '20',
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              }),
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
        
        {/* Основной круг */}
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [
                { scale: circleScale },
                { scale: pulseAnim },
              ],
              backgroundColor: config.secondaryColor,
              borderColor: config.primaryColor,
            },
          ]}
        >
          {/* Lottie анимация для успешного платежа */}
          {config.lottieSource && (
            <LottieView
              source={config.lottieSource}
              autoPlay={true}
              loop={false}
              style={styles.lottieAnimation}
            />
          )}
          
          {/* Иконка статуса */}
          {!config.lottieSource && (
            <Animated.View style={{ opacity: iconOpacity }}>
              <Ionicons
                name={config.icon as any}
                size={compact ? 40 : 64}
                color={config.primaryColor}
              />
            </Animated.View>
          )}

          {/* Вращающаяся анимация для обработки */}
          {isProcessing && (
            <Animated.View
              style={[
                styles.processingRing,
                {
                  borderColor: config.primaryColor,
                  transform: [
                    {
                      rotate: pulseAnim.interpolate({
                        inputRange: [1, 1.05],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            />
          )}
        </Animated.View>
      </View>

      {/* Контент */}
      <Animated.View 
        style={[
          styles.content,
          { opacity: contentOpacity },
          compact && styles.contentCompact,
        ]}
      >
        {/* Статус */}
        <Text style={[
          styles.statusText, 
          { color: theme.heading },
          compact && styles.statusTextCompact,
        ]}>
          {t(`status.${status.status}`).toUpperCase()}
        </Text>

        {/* Сообщение */}
        <Text style={[
          styles.message, 
          { color: theme.text },
          compact && styles.messageCompact,
        ]}>
          {getStatusMessage()}
        </Text>

        {/* Дополнительное сообщение */}
        {!compact && getSubMessage() && (
          <Text style={[styles.subMessage, { color: theme.textSecondary }]}>
            {getSubMessage()}
          </Text>
        )}

        {/* Прогресс бар */}
        {isProcessing && (
          <View style={[styles.progressSection, compact && styles.progressSectionCompact]}>
            <Progress.Bar
              progress={progressAnim}
              width={compact ? width * 0.6 : width * 0.7}
              height={compact ? 6 : 8}
              color={config.primaryColor}
              unfilledColor={theme.border}
              borderWidth={0}
              borderRadius={4}
              animated={true}
            />
            
            <View style={styles.progressInfo}>
              <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                Processing...
              </Text>
              <Text style={[styles.progressPercent, { color: config.primaryColor }]}>
                {status.progress}%
              </Text>
            </View>
          </View>
        )}

        {/* Детали платежа */}
        {!compact && status.details && (
          <View style={[styles.detailsCard, { backgroundColor: theme.card }]}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                Transaction ID
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {status.transactionId || 'N/A'}
              </Text>
            </View>
            {status.amount && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                  Amount
                </Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>
                  ${status.amount.toFixed(2)}
                </Text>
              </View>
            )}
            {status.estimatedTime && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                  Estimated time
                </Text>
                <Text style={[styles.detailValue, { color: theme.text }]}>
                  {status.estimatedTime}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Кнопка повтора для ошибок */}
        {isFailed && onRetry && !compact && (
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: config.primaryColor }]}
            onPress={onRetry}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>
              Try Again
            </Text>
          </TouchableOpacity>
        )}

        {/* Информация о безопасности */}
        {!compact && (
          <View style={[styles.securityInfo, { backgroundColor: theme.card }]}>
            <Ionicons name="shield-checkmark" size={16} color={config.primaryColor} />
            <Text style={[styles.securityText, { color: theme.textSecondary }]}>
              Secured with 256-bit encryption • Powered by Stripe
            </Text>
          </View>
        )}

        {/* Компактная информация о статусе */}
        {compact && (
          <View style={styles.compactInfo}>
            <View style={[styles.statusDot, { backgroundColor: config.primaryColor }]} />
            <Text style={[styles.compactStatus, { color: theme.textSecondary }]}>
              {getStatusMessage()}
            </Text>
            {status.progress > 0 && (
              <Text style={[styles.compactProgress, { color: config.primaryColor }]}>
                {status.progress}%
              </Text>
            )}
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 500,
  },
  containerCompact: {
    padding: 16,
    minHeight: 200,
  },
  confettiOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  confetti: {
    width: width,
    height: width,
  },
  circleWrapper: {
    position: 'relative',
    marginBottom: 32,
  },
  glow: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 100,
    zIndex: -1,
  },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  lottieAnimation: {
    width: 160,
    height: 160,
    position: 'absolute',
  },
  processingRing: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 90,
    borderWidth: 3,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  contentCompact: {
    marginTop: 16,
  },
  statusText: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 1,
  },
  statusTextCompact: {
    fontSize: 18,
    marginBottom: 4,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
    lineHeight: 24,
  },
  messageCompact: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  subMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  progressSectionCompact: {
    marginTop: 4,
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width * 0.7,
    marginTop: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
  },
  detailsCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 24,
  },
  securityText: {
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  },
  compactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  compactStatus: {
    fontSize: 12,
    flex: 1,
  },
  compactProgress: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default PaymentStatus;