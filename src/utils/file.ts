import fs from 'fs';

/**
 * Write the results to a JSON file
 * @param {string} filePath - The path to the file
 * @param {object} data - The data to write
 */
export const writeResultsToFile = (filePath: string, data: object): void => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Results written to ${filePath}`);
};
