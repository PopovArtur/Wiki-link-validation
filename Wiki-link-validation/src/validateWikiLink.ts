import { chromium } from 'playwright';
import prompt from 'prompt-sync';
import fs from 'fs';

const promptSync = prompt();

/**
 * Function to check if a URL is a valid Wikipedia link
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid, otherwise false
 */
const isValidWikiLink = (url: string): boolean => {
  const regex = /^https:\/\/(en\.)?wikipedia\.org\/wiki\/.+$/;
  return regex.test(url);
};

/**
 * Validate and scrape Wikipedia link
 * @param {string} url - The Wikipedia URL
 */
const validateWikiLink = async (url: string): Promise<string[]> => {
  if (!isValidWikiLink(url)) {
    throw new Error('Invalid Wikipedia link');
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const title = await page.title();
    console.log(`Page title: ${title}`);

    const links = await page.$$eval('a[href^="/wiki/"]', anchors =>
      anchors.map(anchor => (anchor as HTMLAnchorElement).href).filter((href, index, self) => self.indexOf(href) === index)
    );

    const uniqueLinks = links
      .filter(link => isValidWikiLink(link))
      .slice(0, 10);
    return uniqueLinks;

  } catch (error: unknown) {
    // Handle error as an Error type explicitly
    if (error instanceof Error) {
      throw new Error('Failed to load the page: ' + error.message);
    } else {
      throw new Error('Unknown error occurred');
    }
  } finally {
    await browser.close();
  }
};

(async () => {
  const wikipediaLink = promptSync('Please provide a Wikipedia link: ').trim(); // Get user input
  const cycleInput = promptSync('Please provide a number of cycles (1 to 3): ').trim();
  const numCycles = parseInt(cycleInput, 10);

  if (!wikipediaLink) {
    console.error('Wikipedia link is required.');
    process.exit(1);
  }

  if (isNaN(numCycles) || numCycles < 1 || numCycles > 3) {
    console.error('Invalid cycle number. Please enter a number between 1 and 3.');
    process.exit(1);
  }

  // Initialize Set with the first input link
  const allLinks = new Set<string>([wikipediaLink]);

  try {
    // Iterate through each cycle
    for (let cycle = 0; cycle < numCycles; cycle++) {
      // Get list of links to process in the current cycle
      const currentCycleLinks = [...allLinks];
      console.log('Current links: ' + currentCycleLinks);
      const newLinks: string[] = [];

      // Process each link in the current cycle's list
      for (const link of currentCycleLinks) {
        const links = await validateWikiLink(link);
        // Collect new unique links found in the current cycle
        links.forEach(l => {
          if (!allLinks.has(l)) {
            newLinks.push(l);
          }
        });
      }

      // Update allLinks with the new unique links
      newLinks.forEach(link => allLinks.add(link));

      console.log(`Cycle ${cycle + 1} completed. New links found:`);
      console.log(newLinks);
    }

    console.log('Scraping completed. All unique links found:');
    const allLinksArray = [...allLinks];
    console.log(allLinksArray);

    // Write results to a JSON file
    const results = {
      allLinks: allLinksArray,
      totalCount: allLinksArray.length,
      uniqueCount: allLinksArray.length, // Unique count, which is the same as the total count for a Set
    };

    fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
    console.log('Results written to results.json');

  } catch (error: unknown) {
    // Handle error as an Error type explicitly
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unknown error occurred');
    }
  }
})();
