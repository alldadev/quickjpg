import { useState, useEffect } from "react";

export function useProStatus() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    // Check if user is Pro from environment variable or localStorage
    const envPro = import.meta.env.VITE_IS_PRO === 'true';
    const localPro = localStorage.getItem('quickjpg_pro') === 'true';
    
    setIsPro(envPro || localPro);
    
    // Listen for storage changes
    const handleStorageChange = () => {
      const localPro = localStorage.getItem('quickjpg_pro') === 'true';
      setIsPro(envPro || localPro);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { isPro };
}
