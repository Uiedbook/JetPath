/**
 * Generate reference based on given length
 * @param {number} length
 * @returns {number}
 */
export const generateReference = (length: number) => {
  if (length <= 0) {
    throw new Error('Length must be greater than 0');
  }
  // Calculate the minimum and maximum bounds for the random number based on the length
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;

  // Generate the random number within the specified range
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate alphanumeric reference based on given length
 * @param {number} length
 * @returns {string}
 */
export const generateAlphanumericReference = (length: number): string => {
  if (length <= 0) {
    throw new Error('Length must be greater than 0');
  }

  const alphanumericCharacters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = alphanumericCharacters.length;
  let reference = '';

  for (let i: number = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    reference += alphanumericCharacters.charAt(randomIndex);
  }

  return reference;
};
