## Wikipedia Link Scraper

### Description

This project is a simple web scraper designed to extract Wikipedia links from a specified URL. 
It accepts a user-provided URL, confirms its validity as a Wikipedia link, and retrieves unique Wikipedia links from the given page. 
The scraper can also iterate through a specified number of cycles to gather additional links from newly discovered pages in each cycle. 
The results, including all unique links and their counts, are saved to a JSON file.

### Requirements

- Node.js (version 14 or higher)
- Playwright
- prompt-sync

### Installation

1. **Clone the repository** (if applicable):
    
    ```bash
    git clone https://github.com/PopovArtur/Wiki-link-validation
    cd Wiki-link-validation
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

### Usage

1. **Start the script**:

    ```bash
    npx ts-node src/main.ts  
    ```

2. **Input the required information**:
   - The script will prompt you to provide a valid Wikipedia link.
   - Then, you will be asked to provide the number of cycles (1 to 3).

3. **View the results**:
   - The script will write the results to a file named `results.json` in the project directory.

### Example

To run the script, follow these steps:

1. **Run the script**:

    ```bash
    npx ts-node src/validateWikiLink.ts  
    ```

2. **Provide the details when prompted**:

    ```plaintext
    Please provide a Wikipedia link: https://en.wikipedia.org/wiki/Node.js
    Please provide a number of cycles (1 to 3): 2
    ```

3. **Check the output**:
   - The console will display progress and new links found in each cycle.
   - The JSON file (`results.json`) will be generated with the list of all unique links found and their counts.

### Explanation

- **URL Validation**:
  - The script checks if the provided URL is a valid Wikipedia link using a regular expression.

- **Scraping Links**:
  - The script uses the Playwright library to navigate to the Wikipedia page and extract links starting with `/wiki/`.

- **Cycle Management**:
  - The script iterates over the specified number of cycles. In each cycle, it processes the current set of links to find new links.

- **Result Storage**:
  - All unique links are stored in a Typecript `Set` to ensure no duplicates.
  - Results are written to a `results.json` file, which includes all unique links, the total count, and the unique count.

### JSON Output Example

Here is an example structure of the `results.json` file:

```json
{
  "allLinks": [
    "https://en.wikipedia.org/wiki/Node.js",
    "https://en.wikipedia.org/wiki/Typescript",
    "https://en.wikipedia.org/wiki/Runtime"
  ],
  "totalCount": 3,
  "uniqueCount": 3
}
```

### Dependencies

- `playwright`: Used to automate browser interactions for scraping.
- `prompt-sync`: Used to prompt for user input.
- `fs`: Used to write results to a JSON file.

### Acknowledgements

Special thanks to the creators of Playwright and prompt-sync libraries for making this project possible.

---

By following this README, you should be able to set up and run the Wikipedia Link Scraper, as well as understand its basic functionality and structure. If you encounter any issues or have questions, feel free to open an issue or contact the repository owner.
