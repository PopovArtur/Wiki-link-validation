import { chromium } from 'playwright';
import prompt from 'prompt-sync';
import fs from 'fs';

// Initialize prompt-sync
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
 * Scrape Wikipedia links from a given URL
 * @param {string} url - The Wikipedia URL
 * @returns {Promise<string[]>} - A list of embedded Wikipedia links
 */
const scrapeWikiLinks = async (url: string): Promise<string[]> => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const links = await page.$$eval('a[href^="/wiki/"]', anchors =>
      anchors
        .map(anchor => (anchor as HTMLAnchorElement).getAttribute('href'))
        .filter((href): href is string => href !== null) // Filter out null hrefs
        .map(href => `https://en.wikipedia.org${href}`)
        .filter(link => !link.includes(':')) // Exclude administrative links
    );

    // Ensure links are unique and return only the top 10
    const uniqueFullLinks = Array.from(new Set(links)).slice(0, 10);
    
    return uniqueFullLinks;
  } catch (error: unknown) {
    // Handle error as an Error type explicitly
    if (error instanceof Error) {
      console.error('Failed to load the page: ', error.message);
    } else {
      console.error('Unknown error occurred');
    }
    return [];
  } finally {
    await browser.close();
  }
};

(async () => {
  const wikipediaLink = promptSync('Please provide a Wikipedia link: ').trim();  // Get user input here
  const cycleInput = promptSync('Please provide a number of cycles (1 to 3): ').trim();
  const numCycles = parseInt(cycleInput, 10);

  if (!isValidWikiLink(wikipediaLink)) {
    console.error('Invalid Wikipedia link provided.');
    process.exit(1);
  }

  if (isNaN(numCycles) || numCycles < 1 || numCycles > 3) {
    console.error('Invalid cycle number. Please enter a number between 1 and 3.');
    process.exit(1);
  }

  const allLinks = new Set<string>();  // Store all unique links found
  const visitedLinks = new Set<string>();  // Keep track of visited links

  try {
    let currentCycleLinks = [wikipediaLink];
    
    for (let cycle = 0; cycle < numCycles; cycle++) {
      const newLinks: string[] = [];

      for (const link of currentCycleLinks) {
        if (!visitedLinks.has(link)) {
          console.log(`Visiting link: ${link}`);
          const links = await scrapeWikiLinks(link);
          links.forEach(l => {
            if (!visitedLinks.has(l) && !allLinks.has(l)) {
              newLinks.push(l);
            }
          });
          visitedLinks.add(link); // Mark the link as visited
        }
      }

      newLinks.forEach(link => allLinks.add(link));  // Add new unique links to the allLinks set
      currentCycleLinks = newLinks;  // Update the currentCycleLinks for the next iteration

      console.log(`Cycle ${cycle + 1} completed. New links found:`);
      console.log(newLinks);
    }

    const results = {
      allLinks: Array.from(allLinks),
      totalCount: allLinks.size,
    };

    fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
    console.log('Results written to results.json');

    console.log('Scraping completed. All unique links found:');
    console.log(results.allLinks);

  } catch (error: unknown) {
    // Handle error as an Error type explicitly
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unknown error occurred');
    }
  }
})();
