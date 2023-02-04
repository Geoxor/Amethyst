/**
 * @returns the total number of DOM elements present in a HTML document.
 */
export const countDomElements = () => document.getElementsByTagName("*").length;

/**
 * Refreshes the current window by reloading the page.
 */
export const refreshWindow = () => location.reload();
