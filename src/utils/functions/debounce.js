/**
 * @param {Function} func - La fonction à debounce
 * @param {number} wait - Le temps d'attente en millisecondes
 * @returns {Function} La fonction debounced
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

