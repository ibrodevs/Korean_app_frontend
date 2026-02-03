export type ErrorType = 
  | 'noInternet'
  | 'noProducts'
  | 'paymentError'
  | 'emptyCart'
  | 'emptyOrders'
  | 'emptyWishlist'
  | 'emptySearch'
  | 'serverError'
  | 'notFound'
  | 'unauthorized'
  | 'loadingError'
  | 'default';

export interface ErrorState {
  type: ErrorType;
  title?: string;
  description?: string;
  icon?: string;
  actions?: ErrorAction[];
  showImage?: boolean;
  imageSource?: any;
  retryFunction?: () => void;
  customContent?: React.ReactNode;
}

export interface ErrorAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  icon?: string;
}

export interface ErrorConfig {
  [key: string]: {
    title: string;
    description: string;
    icon: string;
    showImage: boolean;
    defaultActions: {
      primary?: { label: string; action: 'retry' | 'goBack' | 'goHome' | 'clearFilters' | 'browseAll' };
      secondary?: { label: string; action: 'contactSupport' | 'learnMore' };
    };
  };
}