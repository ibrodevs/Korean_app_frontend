import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Text from './Text';

interface DateOfBirthPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: string) => void;
  initialDate?: string;
}

const { width } = Dimensions.get('window');

const DateOfBirthPicker: React.FC<DateOfBirthPickerProps> = ({
  visible,
  onClose,
  onSelect,
  initialDate = '27 January 1995'
}) => {
  const { theme, isDark } = useTheme();
  
  const getDaysInMonth = (monthName: string, yearValue: string) => {
    const monthIndex = months.indexOf(monthName);
    const yearNumber = parseInt(yearValue, 10);
    if (monthIndex < 0 || Number.isNaN(yearNumber)) {
      return 31;
    }
    return new Date(yearNumber, monthIndex + 1, 0).getDate();
  };
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => (currentYear - i).toString());

  // Парсим начальную дату
  const parseInitialDate = (dateString: string) => {
    if (dateString.includes(' ')) {
      const parts = dateString.split(' ');
      return {
        day: parts[0].padStart(2, '0'),
        month: parts[1],
        year: parts[2]
      };
    }
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      const monthIndex = Math.max(0, Math.min(11, parseInt(month, 10) - 1));
      return {
        day: day.padStart(2, '0'),
        month: months[monthIndex],
        year
      };
    }
    return {
      day: '27',
      month: 'January', 
      year: '1995'
    };
  };

  const initial = parseInitialDate(initialDate);
  const [selectedDay, setSelectedDay] = useState(initial.day);
  const [selectedMonth, setSelectedMonth] = useState(initial.month);
  const [selectedYear, setSelectedYear] = useState(initial.year);

  const days = useMemo(() => {
    const maxDays = getDaysInMonth(selectedMonth, selectedYear);
    return Array.from({ length: maxDays }, (_, i) => (i + 1).toString().padStart(2, '0'));
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const maxDays = getDaysInMonth(selectedMonth, selectedYear);
    const dayNumber = parseInt(selectedDay, 10);
    if (dayNumber > maxDays) {
      setSelectedDay(maxDays.toString().padStart(2, '0'));
    }
  }, [selectedMonth, selectedYear, selectedDay]);

  const handleUpdate = () => {
    const formattedDate = `${selectedDay} ${selectedMonth} ${selectedYear}`;
    onSelect(formattedDate);
    onClose();
  };

  const renderScrollPicker = (
    items: string[], 
    selectedValue: string, 
    onSelect: (value: string) => void,
    width: number
  ) => (
    <View style={[styles.pickerContainer, { width }]}>
      <ScrollView 
        style={styles.picker}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.pickerContent}
      >
        {items.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.pickerItem,
              selectedValue === item && [
                styles.selectedItem, 
                { backgroundColor: theme.primary }
              ]
            ]}
            onPress={() => onSelect(item)}
          >
            <Text
              style={[
                styles.pickerText,
                { color: selectedValue === item ? '#FFFFFF' : theme.text },
                selectedValue === item && { fontWeight: '600' }
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>
              Date of Birth
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerRow}>
            {renderScrollPicker(days, selectedDay, setSelectedDay, 80)}
            {renderScrollPicker(months, selectedMonth, setSelectedMonth, 140)}
            {renderScrollPicker(years, selectedYear, setSelectedYear, 80)}
          </View>

          <TouchableOpacity
            style={[styles.updateButton, { backgroundColor: theme.primary }]}
            onPress={handleUpdate}
          >
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pickerContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  picker: {
    height: 200,
  },
  pickerContent: {
    paddingVertical: 20,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 2,
    borderRadius: 8,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedItem: {
    // backgroundColor applied dynamically
  },
  pickerText: {
    fontSize: 16,
    textAlign: 'center',
  },
  updateButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default DateOfBirthPicker;