export const laborIllusion = (callback, nbSeconds) => {
    const timer = nbSeconds * 1000;
    setTimeout(() => {
        callback();
    }, timer);
}