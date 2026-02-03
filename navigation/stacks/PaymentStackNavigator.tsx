import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PaymentMethodsScreen from '../../screens/PaymentMethodsScreen';
import AddCardScreen from '../../screens/AddCardScreen';
import EditCardScreen from '../../screens/EditCardScreen';

export type PaymentStackParamList = {
  PaymentMethods: {
    newCard?: {
      id: string;
      cardHolder: string;
      cardNumber: string;
      cardNumberRaw: string;
      expiryDate: string;
      cvv: string;
      type: 'VISA' | 'MASTERCARD' | 'AMEX';
    };
    updatedCard?: {
      id: string;
      cardHolder: string;
      cardNumber: string;
      cardNumberRaw: string;
      expiryDate: string;
      cvv: string;
      type: 'VISA' | 'MASTERCARD' | 'AMEX';
    };
    deletedCardId?: string;
  } | undefined;
  AddCard: undefined;
  EditCard: { 
    card: {
      id: string;
      cardHolder: string;
      cardNumber: string;
      cardNumberRaw: string;
      expiryDate: string;
      cvv: string;
      type: 'VISA' | 'MASTERCARD' | 'AMEX';
    };
  };
};

const Stack = createStackNavigator<PaymentStackParamList>();

export default function PaymentStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F9FAFB' },
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateY: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.height, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen
        name="PaymentMethods"
        component={PaymentMethodsScreen}
      />
      <Stack.Screen
        name="AddCard"
        component={AddCardScreen}
      />
      <Stack.Screen
        name="EditCard"
        component={EditCardScreen}
      />
    </Stack.Navigator>
  );
}