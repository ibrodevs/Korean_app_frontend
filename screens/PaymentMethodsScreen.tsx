import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from '../components/Text';
import { useTheme } from '../contexts/ThemeContext';

interface PaymentCard {
  id: string;
  cardHolder: string;
  cardNumber: string;
  cardNumberRaw: string;
  expiryDate: string;
  cvv: string;
  type: 'VISA' | 'MASTERCARD' | 'AMEX';
  gradient?: [string, string];
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = CARD_WIDTH / 1.586;

export default function PaymentMethodsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { theme, isDark } = useTheme();
  
  const scrollX = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const [cards, setCards] = useState<PaymentCard[]>([
    {
      id: '1',
      cardHolder: 'AMANDA MORGAN',
      cardNumber: '•••• •••• •••• 1579',
      cardNumberRaw: '4242424242421579',
      expiryDate: '12/28',
      cvv: '209',
      type: 'VISA',
      gradient: ['#1A1F71', '#667EEA']
    },
    {
      id: '2',
      cardHolder: 'JOHN DOE',
      cardNumber: '•••• •••• •••• 4321',
      cardNumberRaw: '5555555555554444',
      expiryDate: '08/29',
      cvv: '123',
      type: 'MASTERCARD',
      gradient: ['#FF6B6B', '#FFE66D']
    }
  ]);

  const transactions = [
    { 
      id: '1', 
      title: 'Amazon Purchase', 
      merchant: 'Amazon Inc.',
      date: 'April 19, 2024 12:31', 
      amount: '-$14.00', 
      cardId: '1',
      icon: 'cart-outline',
      color: '#FF9900'
    },
    { 
      id: '2', 
      title: 'Spotify Premium', 
      merchant: 'Spotify',
      date: 'April 18, 2024 15:42', 
      amount: '-$9.99', 
      cardId: '1',
      icon: 'musical-notes-outline',
      color: '#1DB954'
    },
    { 
      id: '3', 
      title: 'Uber Ride', 
      merchant: 'Uber Technologies',
      date: 'April 17, 2024 09:15', 
      amount: '-$21.50', 
      cardId: '1',
      icon: 'car-outline',
      color: '#000000'
    },
    { 
      id: '4', 
      title: 'Netflix Subscription', 
      merchant: 'Netflix',
      date: 'April 16, 2024 20:22', 
      amount: '-$15.49', 
      cardId: '2',
      icon: 'tv-outline',
      color: '#E50914'
    },
    { 
      id: '5', 
      title: 'Starbucks', 
      merchant: 'Starbucks Coffee',
      date: 'April 15, 2024 08:30', 
      amount: '-$5.75', 
      cardId: '1',
      icon: 'cafe-outline',
      color: '#006241'
    },
    { 
      id: '6', 
      title: 'Apple Store', 
      merchant: 'Apple Inc.',
      date: 'April 14, 2024 14:20', 
      amount: '-$214.00', 
      cardId: '2',
      icon: 'logo-apple',
      color: '#000000'
    },
  ];

  const getCardIcon = (type: PaymentCard['type']) => {
    switch (type) {
      case 'VISA': return 'logo-cc-visa';
      case 'MASTERCARD': return 'logo-cc-mastercard';
      case 'AMEX': return 'logo-cc-amex';
      default: return 'card-outline';
    }
  };

  const maskCardNumber = (raw: string) => {
    const cleaned = raw.replace(/\D/g, '');
    const last4 = cleaned.slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  const handleAddCard = () => {
    (navigation as any).navigate('AddCard');
  };

  const handleEditCard = (card: PaymentCard) => {
    (navigation as any).navigate('EditCard', {
      card,
    });
  };

  const handleDeleteCard = (cardId: string) => {
    Alert.alert(
      'Remove Card',
      'Are you sure you want to remove this card from your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            Animated.timing(scaleAnim, {
              toValue: 0.9,
              duration: 200,
              useNativeDriver: true,
            }).start(() => {
              setCards(prev => prev.filter(card => card.id !== cardId));
              scaleAnim.setValue(1);
            });
          }
        }
      ]
    );
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

  const renderCard = ({ item, index }: { item: PaymentCard; index: number }) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.92, 1, 0.92],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View 
        style={[
          styles.cardWrapper,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <Pressable
          style={styles.cardPressable}
          onPress={() => handleEditCard(item)}
          onLongPress={() => handleDeleteCard(item.id)}
        >
          <LinearGradient
            colors={item.gradient || ['#667EEA', '#764BA2']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Эффект бликов */}
            <View style={styles.cardShine} />
            
            <View style={styles.cardHeader}>
              <View style={styles.cardTypeContainer}>
                <Ionicons name={getCardIcon(item.type)} size={32} color="#FFFFFF" />
                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>{item.type}</Text>
                </View>
              </View>
              <View style={styles.cardChip}>
                <Ionicons name="hardware-chip" size={32} color="rgba(255,255,255,0.9)" />
              </View>
            </View>

            <View style={styles.cardNumberContainer}>
              <Text style={styles.cardNumberText}>{maskCardNumber(item.cardNumberRaw)}</Text>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.cardDetails}>
                <Text style={styles.cardLabel}>CARD HOLDER</Text>
                <Text style={styles.cardHolderText}>{item.cardHolder}</Text>
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.cardLabel}>VALID THRU</Text>
                <Text style={styles.cardExpiryText}>{item.expiryDate}</Text>
              </View>
            </View>

            {/* Декоративные элементы */}
            <View style={styles.cardDecorations}>
              <View style={[styles.cardCircle, styles.cardCircle1]} />
              <View style={[styles.cardCircle, styles.cardCircle2]} />
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Заголовок в цвет фона */}
      <View
        style={[
          styles.headerGradient,
          { backgroundColor: theme.background, borderBottomColor: `${theme.border}40` },
        ]}
      >
        <View style={styles.headerContent}>
          <Pressable 
            onPress={() => navigation.goBack()} 
            style={[styles.backButton, { backgroundColor: theme.card }]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={28} color={theme.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.heading }]}>Payment Methods</Text>
          <TouchableOpacity 
            style={[styles.headerAction, { backgroundColor: theme.card }]}
            onPress={handleAddCard}
          >
            <Ionicons name="add-circle" size={28} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Карточки карусель */}
        {cards.length > 0 ? (
          <View style={styles.cardsCarousel}>
            <Animated.ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
              decelerationRate="fast"
              snapToInterval={CARD_WIDTH}
            >
              {cards.map((card, index) => (
                <View key={card.id} style={styles.carouselItem}>
                  {renderCard({ item: card, index })}
                </View>
              ))}
            </Animated.ScrollView>
            
            {/* Индикаторы */}
            <View style={styles.carouselIndicators}>
              {cards.map((_, index) => {
                const inputRange = [
                  (index - 1) * CARD_WIDTH,
                  index * CARD_WIDTH,
                  (index + 1) * CARD_WIDTH,
                ];

                const width = scrollX.interpolate({
                  inputRange,
                  outputRange: [8, 20, 8],
                  extrapolate: 'clamp',
                });

                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.4, 1, 0.4],
                  extrapolate: 'clamp',
                });

                return (
                  <Animated.View
                    key={index}
                    style={[
                      styles.indicator,
                      {
                        width,
                        opacity,
                        backgroundColor: theme.primary,
                      },
                    ]}
                  />
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.emptyCards}>
            <View style={[styles.emptyCard, { backgroundColor: theme.surface }]}>
              <Ionicons name="card-outline" size={64} color={theme.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No Cards Added
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Add a payment method to get started
              </Text>
            </View>
          </View>
        )}

        {/* Кнопка добавления карты */}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={handleAddCard}
          activeOpacity={0.8}
        >
          <View style={styles.addButtonIcon}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.addButtonText}>Add New Card</Text>
        </TouchableOpacity>

        {/* История транзакций */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recent Transactions
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsList}>
            {transactions.map((transaction) => {
              const card = cards.find(c => c.id === transaction.cardId) || cards[0];
              return (
                <TouchableOpacity
                  key={transaction.id}
                  style={[styles.transactionItem, { backgroundColor: theme.surface }]}
                  activeOpacity={0.7}
                >
                  <View style={styles.transactionLeft}>
                    <View 
                      style={[
                        styles.transactionIcon, 
                        { backgroundColor: transaction.color + '20' }
                      ]}
                    >
                      <Ionicons 
                        name={transaction.icon as any} 
                        size={20} 
                        color={transaction.color} 
                      />
                    </View>
                    <View style={styles.transactionDetails}>
                      <Text style={[styles.transactionTitle, { color: theme.text }]}>
                        {transaction.title}
                      </Text>
                      <Text style={[styles.transactionMerchant, { color: theme.textSecondary }]}>
                        {transaction.merchant} • {transaction.date}
                      </Text>
                      <View style={styles.transactionCardInfo}>
                        <Ionicons 
                          name={getCardIcon(card.type)} 
                          size={12} 
                          color={theme.textSecondary} 
                        />
                        <Text style={[styles.transactionCardText, { color: theme.textSecondary }]}>
                          {card.type} •••• {card.cardNumberRaw.slice(-4)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={[styles.transactionAmount, { color: theme.text }]}>
                      {transaction.amount}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingBottom: 40,
  },
  cardsCarousel: {
    marginTop: -30,
    marginBottom: 24,
  },
  carouselItem: {
    width: CARD_WIDTH,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  cardPressable: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardGradient: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardShine: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ rotate: '45deg' }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardChip: {
    opacity: 0.9,
  },
  cardNumberContainer: {
    marginVertical: 20,
  },
  cardNumberText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardDetails: {
    gap: 4,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cardHolderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  cardExpiryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardDecorations: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  cardCircle: {
    position: 'absolute',
    borderRadius: 50,
  },
  cardCircle1: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    right: -30,
    bottom: -30,
  },
  cardCircle2: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    right: -50,
    bottom: 20,
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  indicator: {
    height: 6,
    borderRadius: 3,
  },
  emptyCards: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  emptyCard: {
    height: CARD_HEIGHT,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    marginBottom: 32,
    shadowColor: '#1779F3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  addButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  historySection: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionDetails: {
    flex: 1,
    gap: 4,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  transactionMerchant: {
    fontSize: 12,
  },
  transactionCardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  transactionCardText: {
    fontSize: 11,
  },
  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
});