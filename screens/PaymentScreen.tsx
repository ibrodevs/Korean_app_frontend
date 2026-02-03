import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import Text from '../components/Text';
import Button from '../components/Button';

const PaymentScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handleCreditCard = () => {
    // Navigate to credit card payment
    console.log('Credit card payment selected');
  };

  const handleBankTransfer = () => {
    // Navigate to bank transfer
    console.log('Bank transfer selected');
  };

  const handleDigitalWallet = () => {
    // Navigate to digital wallet payment
    console.log('Digital wallet payment selected');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
    },
    header: {
      textAlign: 'center',
      marginBottom: 30,
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
    },
    methodContainer: {
      marginBottom: 15,
    },
    methodTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 5,
    },
    methodDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 10,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{t('payment.title', 'Payment Methods')}</Text>
      
      <View style={styles.methodContainer}>
        <Text style={styles.methodTitle}>{t('payment.creditCard', 'Credit Card')}</Text>
        <Text style={styles.methodDescription}>
          {t('payment.creditCardDesc', 'Pay securely with your credit or debit card')}
        </Text>
        <Button
          title={t('payment.selectCreditCard', 'Select Credit Card')}
          onPress={handleCreditCard}
          variant="outline"
        />
      </View>
      
      <View style={styles.methodContainer}>
        <Text style={styles.methodTitle}>{t('payment.bankTransfer', 'Bank Transfer')}</Text>
        <Text style={styles.methodDescription}>
          {t('payment.bankTransferDesc', 'Transfer directly from your bank account')}
        </Text>
        <Button
          title={t('payment.selectBankTransfer', 'Select Bank Transfer')}
          onPress={handleBankTransfer}
          variant="outline"
        />
      </View>
      
      <View style={styles.methodContainer}>
        <Text style={styles.methodTitle}>{t('payment.digitalWallet', 'Digital Wallet')}</Text>
        <Text style={styles.methodDescription}>
          {t('payment.digitalWalletDesc', 'Pay with your preferred digital wallet')}
        </Text>
        <Button
          title={t('payment.selectDigitalWallet', 'Select Digital Wallet')}
          onPress={handleDigitalWallet}
          variant="outline"
        />
      </View>
    </ScrollView>
  );
};

export default PaymentScreen;