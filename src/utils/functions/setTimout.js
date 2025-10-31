export const setTimeOutNavigator = (navigate, url, timer) => {
    setTimeout(() => {
        navigate(url);
    }, timer);
}