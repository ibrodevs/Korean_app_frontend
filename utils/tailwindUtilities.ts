// Simplified tailwind utilities for React Native and Web compatibility

export interface TailwindStyle {
  [key: string]: any;
}

const tailwindClassMap: Record<string, TailwindStyle> = {
  // Margin classes
  'mb-4': { marginBottom: 16 },
  'mb-2': { marginBottom: 8 },
  'mb-6': { marginBottom: 24 },
  'mt-4': { marginTop: 16 },
  'mt-2': { marginTop: 8 },
  'mt-6': { marginTop: 24 },
  'mx-4': { marginHorizontal: 16 },
  'mx-1': { marginHorizontal: 4 },
  'my-4': { marginVertical: 16 },
  'mr-3': { marginRight: 12 },
  'mr-4': { marginRight: 16 },
  'mr-2': { marginRight: 8 },
  'ml-3': { marginLeft: 12 },
  'ml-2': { marginLeft: 8 },
  'm-0': { margin: 0 },
  
  // Padding classes
  'p-4': { padding: 16 },
  'p-2': { padding: 8 },
  'p-6': { padding: 24 },
  'px-4': { paddingHorizontal: 16 },
  'px-5': { paddingHorizontal: 20 },
  'py-2': { paddingVertical: 8 },
  'py-4': { paddingVertical: 16 },
  'pb-24': { paddingBottom: 96 },
  
  // Display classes
  'flex': { display: 'flex' },
  'flex-1': { flex: 1 },
  'flex-row': { flexDirection: 'row' },
  'flex-col': { flexDirection: 'column' },
  'items-center': { alignItems: 'center' },
  'justify-center': { justifyContent: 'center' },
  'justify-between': { justifyContent: 'space-between' },
  'justify-around': { justifyContent: 'space-around' },
  
  // Width/Height
  'w-full': { width: '100%' },
  'h-full': { height: '100%' },
  'w-1/2': { width: '50%' },
  'w-1/3': { width: '33.333333%' },
  'w-2/3': { width: '66.666667%' },
  
  // Background colors (basic)
  'bg-white': { backgroundColor: '#ffffff' },
  'bg-black': { backgroundColor: '#000000' },
  'bg-gray-100': { backgroundColor: '#f3f4f6' },
  'bg-gray-200': { backgroundColor: '#e5e7eb' },
  
  // Text colors
  'text-white': { color: '#ffffff' },
  'text-black': { color: '#000000' },
  'text-gray-600': { color: '#6b7280' },
  
  // Text alignment
  'text-center': { textAlign: 'center' },
  'text-left': { textAlign: 'left' },
  'text-right': { textAlign: 'right' },
  
  // Font weight
  'font-bold': { fontWeight: 'bold' },
  'font-semibold': { fontWeight: '600' },
  'font-medium': { fontWeight: '500' },
  'font-normal': { fontWeight: 'normal' },
  
  // Border radius
  'rounded': { borderRadius: 4 },
  'rounded-md': { borderRadius: 6 },
  'rounded-lg': { borderRadius: 8 },
  'rounded-full': { borderRadius: 9999 },
  
  // Position
  'absolute': { position: 'absolute' },
  'relative': { position: 'relative' },
  
  // Z-index
  'z-10': { zIndex: 10 },
  'z-20': { zIndex: 20 },
  
  // Shadow (basic implementation)
  'shadow': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  'shadow-lg': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  }
};

// Simple tailwind utility function
export const tailwind = (classNames: string): TailwindStyle => {
  const classes = classNames.split(' ').filter(Boolean);
  const styles: TailwindStyle = {};
  
  classes.forEach(className => {
    const style = tailwindClassMap[className];
    if (style) {
      Object.assign(styles, style);
    }
  });
  
  return styles;
};

// Hook for React components
export const useTailwind = () => tailwind;

// Default export for compatibility
export default tailwind;


