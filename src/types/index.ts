export interface StegImageData {
  original: File | null;
  preview: string | null;
  encoded: string | null;
}

export interface SectionProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}