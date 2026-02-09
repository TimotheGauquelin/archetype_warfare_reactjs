/**
 * @param {Function} callback - The function to call after the delay
 * @param {number} nbSeconds - The delay in seconds
 */
export const laborIllusion = (callback: () => void, nbSeconds: number): void => {
    const timer = nbSeconds * 1000;
    setTimeout(() => {
        callback();
    }, timer);
}