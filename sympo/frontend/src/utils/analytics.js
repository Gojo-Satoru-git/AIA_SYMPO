import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";

export const trackEvent = (eventName, data = {}) => {
    if(!analytics) return;
    logEvent(analytics, eventName, data);
};