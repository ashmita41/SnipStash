import { PrismStatic } from 'prismjs';

declare global {
  interface Window {
    Prism: PrismStatic;
  }
} 