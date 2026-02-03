// Common inline styles to replace tailwind-rn which is incompatible with Expo Web

export const tw = (className: string): Record<string, any> => {
  const classMap: Record<string, Record<string, any>> = {
    // Margin
    'mb-4': { marginBottom: 16 },
    'mb-2': { marginBottom: 8 },
    'mb-6': { marginBottom: 24 },
    'mt-1': { marginTop: 4 },
    'mt-2': { marginTop: 8 },
    'mt-4': { marginTop: 16 },
    'ml-3': { marginLeft: 12 },
    'mr-1': { marginRight: 4 },
    'mr-3': { marginRight: 12 },
    'mx-4': { marginHorizontal: 16 },
    // Padding
    'pl-0': { paddingLeft: 0 },
    'p-4': { padding: 16 },
    // Flex
    'flex-row': { flexDirection: 'row' },
    'flex-col': { flexDirection: 'column' },
    'items-center': { alignItems: 'center' },
    // Misc
    'm-0': { margin: 0 },
  };

  const styles: Record<string, any> = {};
  className.split(' ').forEach(cls => {
    const style = classMap[cls];
    if (style) Object.assign(styles, style);
  });
  return styles;
};

// Helper function to create box shadows that work on both web and native
export const createBoxShadow = (
  offsetX: number = 0, 
  offsetY: number = 2, 
  blurRadius: number = 4, 
  color: string = '#000000', 
  opacity: number = 0.1,
  elevation: number = 3
) => ({
  boxShadow: `${offsetX}px ${offsetY}px ${blurRadius}px ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
  elevation,
});

// Predefined shadow styles for common use cases
export const shadows = {
  small: createBoxShadow(0, 1, 3, '#000000', 0.05, 2),
  medium: createBoxShadow(0, 4, 8, '#000000', 0.1, 4),
  large: createBoxShadow(0, 6, 15, '#000000', 0.15, 8),
  card: createBoxShadow(0, 2, 4, '#000000', 0.08, 3),
};
