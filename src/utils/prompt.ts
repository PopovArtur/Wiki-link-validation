import prompt from 'prompt-sync';

const promptSync = prompt();

/**
 * Get user input for the Wikipedia link and the number of cycles
 * @returns {object} - An object containing the Wikipedia link and number of cycles
 */
export const getUserInput = (): { wikipediaLink: string, numCycles: number } => {
  const wikipediaLink = promptSync('Please provide a Wikipedia link: ').trim();
  const cycleInput = promptSync('Please provide a number of cycles (1 to 3): ').trim();
  const numCycles = parseInt(cycleInput, 10);

  if (!wikipediaLink) {
    throw new Error('Wikipedia link is required.');
  }

  if (isNaN(numCycles) || numCycles < 1 || numCycles > 3) {
    throw new Error('Invalid cycle number. Please enter a number between 1 and 3.');
  }

  return { wikipediaLink, numCycles };
};
