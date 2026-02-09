import type { NavigateFunction } from "react-router-dom";

export const setTimeOutNavigator = (navigate: NavigateFunction, url: string, timer: number): void => {
    setTimeout(() => {
        navigate(url);
    }, timer);
}