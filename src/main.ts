import { validateWikiLink } from './services/scraper';
import { getUserInput } from './utils/prompt';
import { writeResultsToFile } from './utils/file';

(async () => {
  try {
    const { wikipediaLink, numCycles } = getUserInput();

    const allLinks = new Set<string>([wikipediaLink]);
    const amountOfDesiredExpectedUniqueLinks = 10;

    // Iterate through each cycle
    for (let cycle = 0; cycle < numCycles; cycle++) {
      const currentCycleLinks = [...allLinks];
      const newLinks: string[] = [];

      for (const link of currentCycleLinks) {
        const links = await validateWikiLink(link);
        links.forEach(l => {
          if (!allLinks.has(l) && newLinks.length < amountOfDesiredExpectedUniqueLinks) {
            newLinks.push(l);
          }
        });
      }

      newLinks.forEach(link => allLinks.add(link));

      console.log(`Cycle ${cycle + 1} completed. New links found:`);
      console.log(newLinks);
    }

    console.log('Scraping completed. All unique links found:');
    const allLinksArray = [...allLinks];
    console.log(allLinksArray);

    const results = {
      allLinks: allLinksArray,
      totalCount: allLinksArray.length,
      uniqueCount: allLinksArray.length,
    };

    writeResultsToFile('results.json', results);

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unknown error occurred');
    }
  }
})();
