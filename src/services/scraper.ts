import { chromium } from 'playwright';
import { isValidWikiLink } from './validation';

/**
 * Validate and scrape Wikipedia link
 * @param {string} url - The Wikipedia URL
 */
export const validateWikiLink = async (url: string): Promise<string[]> => {
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

    const validLinks = links
      .filter(link => isValidWikiLink(link));

    return validLinks;

  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Failed to load the page: ' + error.message);
    } else {
      throw new Error('Unknown error occurred');
    }
  } finally {
    await browser.close();
  }
};
