'use client'

import { useEffect } from 'react'

export default function SuppressHydrationWarnings() {
  useEffect(() => {
    // Suprimir warnings de hidratação causados por extensões do navegador
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      if (typeof args[0] === 'string') {
        // Suprimir warnings específicos de hidratação
        if (
          args[0].includes('Extra attributes from the server') ||
          args[0].includes('data-atm-ext-installed') ||
          args[0].includes('Hydration failed') ||
          args[0].includes('Text content does not match server-rendered HTML')
        ) {
          return; // Suprimir estes warnings
        }
      }
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      if (typeof args[0] === 'string') {
        // Suprimir warnings específicos de hidratação
        if (
          args[0].includes('Extra attributes from the server') ||
          args[0].includes('data-atm-ext-installed') ||
          args[0].includes('Hydration failed') ||
          args[0].includes('Text content does not match server-rendered HTML')
        ) {
          return; // Suprimir estes warnings
        }
      }
      originalWarn.apply(console, args);
    };

    // Cleanup function
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return null; // Este componente não renderiza nada
}

