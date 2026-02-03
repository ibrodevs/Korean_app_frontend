// Новая цветовая палитра для Korean E-commerce App
// Обновлено: январь 2026

export const NEW_COLOR_PALETTE = {
  // Основная палитра
  primary: {
    DEFAULT: '#1774F3',
    hover: '#2563EB', 
    active: '#1D4ED8',
    disabled: '#93C5FD'
  },

  // Светлая тема (Light)
  light: {
    background: {
      primary: '#FFFFFF',    // основной фон
      secondary: '#F5F7FB'   // вторичный фон (секции, карточки)
    },
    text: {
      primary: '#0F172A',    // основной текст (очень тёмный, не чисто чёрный)
      secondary: '#475569',  // вторичный текст
      hint: '#94A3B8'       // подписи, хинты
    },
    border: '#E2E8F0'       // границы / линии
  },

  // Тёмная тема (Dark)
  dark: {
    background: {
      primary: '#0B1020',    // основной фон
      secondary: '#111827',  // карточки / секции  
      hover: '#1F2933'       // hover / активные блоки
    },
    text: {
      primary: '#F8FAFC',    // основной текст
      secondary: '#CBD5E1',  // вторичный текст
      hint: '#64748B'        // подсказки
    },
    border: '#1E293B'        // границы
  },

  // Состояния кнопок (важно)
  button: {
    primary: {
      default: '#1774F3',
      hover: '#2563EB',
      active: '#1D4ED8', 
      disabled: '#93C5FD'
    }
  },

  // Дополнительные цвета (сохранены из предыдущей версии)
  error: '#F76C6C'
};

// Примеры использования:
// Для CTA-кнопок: NEW_COLOR_PALETTE.primary.DEFAULT
// Для активных ссылок: NEW_COLOR_PALETTE.primary.hover
// Для акцентов: NEW_COLOR_PALETTE.primary.DEFAULT
// Для иконок: NEW_COLOR_PALETTE.primary.DEFAULT
// Для hover/focus состояний: NEW_COLOR_PALETTE.primary.hover