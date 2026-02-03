import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaymentCard, PaymentMethod, PaymentRequest, PaymentResponse } from '../types/payment';

const SAVED_CARDS_KEY = '@user_payment_cards';
const TRANSACTIONS_KEY = '@user_transactions';

export const paymentService = {
  // Имитация задержки сети
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Получение сохраненных карт
  getSavedCards: async (): Promise<PaymentCard[]> => {
    await paymentService.delay(300);
    try {
      const cards = await AsyncStorage.getItem(SAVED_CARDS_KEY);
      if (cards) {
        return JSON.parse(cards);
      }
      return [];
    } catch (error) {
      console.error('Error getting saved cards:', error);
      return [];
    }
  },

  // Сохранение карты
  saveCard: async (cardData: any): Promise<PaymentCard> => {
    await paymentService.delay(500);
    try {
      const cards = await paymentService.getSavedCards();
      const lastFour = cardData.number.slice(-4);
      
      const newCard: PaymentCard = {
        id: `card_${Date.now()}`,
        type: 'visa', // Определяем тип по номеру
        lastFour,
        expiryMonth: cardData.expiry.split('/')[0],
        expiryYear: `20${cardData.expiry.split('/')[1]}`,
        cardHolder: cardData.cardHolder,
        isDefault: cards.length === 0, // Первая карта становится дефолтной
      };

      // Если это карта по умолчанию, снимаем флаг с других карт
      if (newCard.isDefault) {
        cards.forEach(card => {
          card.isDefault = false;
        });
      }

      cards.push(newCard);
      await AsyncStorage.setItem(SAVED_CARDS_KEY, JSON.stringify(cards));
      
      return newCard;
    } catch (error) {
      console.error('Error saving card:', error);
      throw error;
    }
  },

  // Получение методов оплаты
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    await paymentService.delay(200);
    return [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        type: 'card',
        icon: 'card-outline',
        description: 'Pay with Visa, Mastercard, or Amex',
      },
      {
        id: 'paypal',
        name: 'PayPal',
        type: 'paypal',
        icon: 'logo-paypal',
        description: 'Fast and secure payment',
        fee: 0.50,
      },
      {
        id: 'apple',
        name: 'Apple Pay',
        type: 'apple',
        icon: 'logo-apple',
        description: 'Pay with Apple Pay',
      },
      {
        id: 'google',
        name: 'Google Pay',
        type: 'google',
        icon: 'logo-google',
        description: 'Pay with Google Pay',
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        type: 'cod',
        icon: 'cash-outline',
        description: 'Pay when you receive your order',
        fee: 2.00,
      },
    ];
  },

  // Обработка платежа
  processPayment: async (paymentRequest: PaymentRequest): Promise<PaymentResponse> => {
    await paymentService.delay(2000); // Имитация процесса оплаты
    
    try {
      // Генерация ID транзакции
      const transactionId = `txn_${Date.now().toString().slice(-10)}`;
      
      // 90% успешных платежей для демонстрации
      const isSuccess = Math.random() > 0.1;
      
      const response: PaymentResponse = {
        success: isSuccess,
        transactionId,
        status: isSuccess ? 'completed' : 'failed',
        message: isSuccess 
          ? 'Payment processed successfully' 
          : 'Payment failed. Please try again.',
        timestamp: new Date().toISOString(),
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
      };

      // Сохранение транзакции
      const existingTransactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
      transactions.push(response);
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));

      if (!isSuccess) {
        throw new Error('Payment failed');
      }

      return response;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  },

  // Обновление статуса заказа
  updateOrderStatus: async (orderId: string, status: string, transactionId: string): Promise<void> => {
    await paymentService.delay(300);
    // Здесь будет логика обновления статуса заказа
    console.log(`Order ${orderId} updated to ${status} with transaction ${transactionId}`);
  },

  // Получение истории транзакций
  getTransactionHistory: async (): Promise<PaymentResponse[]> => {
    await paymentService.delay(300);
    try {
      const transactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      if (transactions) {
        return JSON.parse(transactions);
      }
      return [];
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return [];
    }
  },
};