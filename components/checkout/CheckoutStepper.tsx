import React from 'react';
import {
  View,
  
  StyleSheet,
} from 'react-native';
import Text from '../../components/Text';
import { useTailwind } from '../../utils/tailwindUtilities';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface CheckoutStepperProps {
  currentStep: number;
}

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ currentStep }) => {
  const tailwind = useTailwind();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const steps = [
    { id: 1, title: t('checkout.step1') },
    { id: 2, title: t('checkout.step2') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={step.id} style={styles.stepWrapper}>
            {/* Линия между шагами */}
            {index > 0 && (
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor: currentStep >= step.id ? theme.primary : theme.border,
                  },
                ]}
              />
            )}

            {/* Кружок шага */}
            <View
              style={[
                styles.stepCircle,
                {
                  backgroundColor: currentStep >= step.id ? theme.primary : theme.card,
                  borderColor: currentStep >= step.id ? theme.primary : theme.border,
                },
              ]}
            >
              {currentStep > step.id ? (
                <Text style={[styles.stepNumber, { color: theme.heading }]}>
                  ✓
                </Text>
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    {
                      color: currentStep >= step.id ? theme.heading : theme.text,
                    },
                  ]}
                >
                  {step.id}
                </Text>
              )}
            </View>

            {/* Название шага */}
            <Text
              style={[
                styles.stepTitle,
                {
                  color: currentStep >= step.id ? theme.primary : theme.textSecondary,
                },
              ]}
            >
              {step.title}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepWrapper: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  line: {
    position: 'absolute',
    top: 15,
    left: -50,
    right: 50,
    height: 2,
    zIndex: -1,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 80,
  },
});

export default CheckoutStepper;