/**
 * Function to check if a URL is a valid Wikipedia link
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid, otherwise false
 */
export const isValidWikiLink = (url: string): boolean => {
  const regex = /^https:\/\/(en\.)?wikipedia\.org\/wiki\/.+$/;
  return regex.test(url);
};
  