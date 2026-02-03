export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  illustration: React.ReactNode;
}

export interface OnboardingPaginationProps {
  slides: OnboardingSlide[];
  currentIndex: number;
  onDotPress?: (index: number) => void;
}