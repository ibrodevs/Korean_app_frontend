import { Text, View } from '@/components/styled';
import React from 'react';

export default function TestTailwind() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-primary">
        Tailwind работает! 🎉
      </Text>
      <Text className="text-sm text-gray-600 mt-4">
        Компонент HomeScreen оптимизирован
      </Text>
      <View className="mt-6 px-4 py-3 bg-primary rounded-lg">
        <Text className="text-white font-medium">
          Стили применяются корректно
        </Text>
      </View>
    </View>
  );
}