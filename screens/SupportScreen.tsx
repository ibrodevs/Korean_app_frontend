import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import Text from '../components/Text';
import Button from '../components/Button';

const SupportScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@koreanapp.com');
  };

  const handlePhoneSupport = () => {
    Linking.openURL('tel:+821234567890');
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
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 10,
    },
    contactInfo: {
      marginBottom: 10,
    },
    button: {
      marginBottom: 15,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{t('support.title', 'Support')}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('support.contactUs', 'Contact Us')}
        </Text>
        
        <Button
          title={t('support.emailSupport', 'Email Support')}
          onPress={handleEmailSupport}
          style={styles.button}
          variant="outline"
        />
        
        <Button
          title={t('support.phoneSupport', 'Phone Support')}
          onPress={handlePhoneSupport}
          style={styles.button}
          variant="outline"
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('support.faq', 'Frequently Asked Questions')}
        </Text>
        <Text style={styles.contactInfo}>
          {t('support.faqDescription', 'Visit our FAQ section for quick answers to common questions.')}
        </Text>
      </View>
    </ScrollView>
  );
};

export default SupportScreen;