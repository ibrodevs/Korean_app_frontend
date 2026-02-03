import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import Text from '../components/Text';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import BlueBg from '../assets/Ellipse.svg';

interface PaymentCard {
  id: string;
  cardHolder: string;
  cardNumber: string;
  cardNumberRaw: string;
  expiryDate: string;
  cvv: string;
  type: 'VISA' | 'MASTERCARD' | 'AMEX';
}

export default function PaymentMethodsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { theme, isDark } = useTheme();
  const blueBgSource = typeof BlueBg === 'string' ? { uri: BlueBg } : BlueBg;
  
  const [cards, setCards] = useState<PaymentCard[]>([
    {
      id: '1',
      cardHolder: 'AMANDA MORGAN',
      cardNumber: '•••• •••• •••• 1579',
      cardNumberRaw: '4242424242421579',
      expiryDate: '12/28',
      cvv: '209',
      type: 'VISA'
    }
  ]);

  const maskCardNumber = (raw: string) => {
    const cleaned = raw.replace(/\D/g, '');
    const last4 = cleaned.slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  const transactions = [
    { id: '1', title: 'Order #92287157', date: 'April,19 2020 12:31', amount: '-$14,00', cardId: '1' },
    { id: '2', title: 'Order #92287157', date: 'April,19 2020 12:31', amount: '-$37,00', cardId: '1' },
    { id: '3', title: 'Order #92287157', date: 'April,19 2020 12:31', amount: '-$21,00', cardId: '1' },
    { id: '4', title: 'Order #92287157', date: 'April,19 2020 12:31', amount: '-$75,00', cardId: '1' },
    { id: '5', title: 'Order #92287157', date: 'April,19 2020 12:31', amount: '-$214,00', cardId: '1' },
    { id: '6', title: 'Order #92287157', date: 'April,19 2020 12:31', amount: '-$53,00', cardId: '1' },
  ];

  const handleAddCard = () => {
    (navigation as any).navigate('AddCard');
  };

  const handleEditCard = (card: PaymentCard) => {
    (navigation as any).navigate('EditCard', {
      card,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      const params = (route as any).params as {
        newCard?: PaymentCard;
        updatedCard?: PaymentCard;
        deletedCardId?: string;
      } | undefined;

      if (params?.newCard) {
        setCards(prev => [params.newCard as PaymentCard, ...prev]);
      }

      if (params?.updatedCard) {
        setCards(prev => prev.map(item => item.id === params.updatedCard?.id ? params.updatedCard as PaymentCard : item));
      }

      if (params?.deletedCardId) {
        setCards(prev => prev.filter(item => item.id !== params.deletedCardId));
      }

      if (params?.newCard || params?.updatedCard || params?.deletedCardId) {
        (navigation as any).setParams({ newCard: undefined, updatedCard: undefined, deletedCardId: undefined });
      }
    }, [route, navigation])
  );

  const handleDeleteCard = (cardId: string) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCards(prev => prev.filter(card => card.id !== cardId));
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <StatusBar backgroundColor="#1779F3" barStyle="light-content" />

      <Image source={blueBgSource} style={styles.blueimg} resizeMode="cover" />

      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Payment methods</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cards Display */}
        <View style={styles.cardsContainer}>
          {cards.map((card) => (
            <Pressable 
              key={card.id} 
              style={[styles.creditCard, { backgroundColor: isDark ? theme.surface : '#FFFFFF' }]}
              onPress={() => handleEditCard(card)}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardType, { color: isDark ? '#93C5FD' : '#1E40AF' }]}>{card.type}</Text>
                <Ionicons name="settings-outline" size={18} color={isDark ? theme.textSecondary : '#6B7280'} />
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardNumber, { color: theme.text }]}>{maskCardNumber(card.cardNumberRaw)}</Text>
                <Text style={[styles.cardHolder, { color: theme.textSecondary }]}>{card.cardHolder}</Text>
                <Text style={[styles.cardExpiry, { color: theme.textSecondary }]}>{card.expiryDate}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable style={[styles.addNewButton, { backgroundColor: theme.primary }]} onPress={handleAddCard}>
          <Text style={styles.addNewText}>Add New Card</Text>
        </Pressable>

        {/* History List */}
        <View style={styles.historyContainer}>
          {transactions.map((item) => {
            const card = cards.find(c => c.id === item.cardId) ?? cards[0];
            const cardLabel = card
              ? `${card.type} •••• ${card.cardNumberRaw.slice(-4)}`
              : 'Card';
            return (
            <View key={item.id} style={[styles.historyItem, { backgroundColor: isDark ? theme.card : '#F7F8FC' }]}> 
              <View style={styles.historyLeft}>
                <View style={[styles.historyIcon, { backgroundColor: isDark ? '#1E293B' : '#E8EEFF' }]}> 
                  <Ionicons name="briefcase-outline" size={16} color={isDark ? '#60A5FA' : '#2563EB'} />
                </View>
                <View>
                  <Text style={[styles.historyDate, { color: theme.textSecondary }]}>{item.date}</Text>
                  <Text style={[styles.historyTitle, { color: theme.text }]}>{item.title}</Text>
                  <Text style={[styles.historyCard, { color: theme.textSecondary }]}>{cardLabel}</Text>
                </View>
              </View>
              <Text style={[styles.historyAmount, { color: theme.text }]}>{item.amount}</Text>
            </View>
          );})}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blueimg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    marginBottom: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingBottom: 32,
    backgroundColor: 'transparent',
  },
  cardsContainer: {
    paddingHorizontal: 24,
    marginTop: 10,
  },
  creditCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E40AF',
  },
  cardBody: {
    gap: 8,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  cardHolder: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  cardExpiry: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  historyContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7F8FC',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8EEFF',
    marginRight: 10,
  },
  historyDate: {
    fontSize: 11,
    color: '#6B7280',
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  historyCard: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  addNewButton: {
    marginTop: 8,
    marginHorizontal: 24,
    backgroundColor: '#1E78F2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addNewText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});