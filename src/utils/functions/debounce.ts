/**
 * @param {Function} func - La fonction à debounce
 * @param {number} wait - Le temps d'attente en millisecondes
 * @returns {Function} La fonction debounced
 */
export const debounce = <T extends (...args: any[]) => void>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | undefined;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

