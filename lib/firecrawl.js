import FirecrawlApp from "@mendable/firecrawl-js";

export async function scrapeProduct(url) {
    const apiKey = process.env.FIRECRAWL_API_KEY;

    if (!apiKey) {
        throw new Error("Missing FIRECRAWL_API_KEY environment variable");
    }

    const firecrawl = new FirecrawlApp({
        apiKey: apiKey.trim(),
    });

    const extractionSchema = {
        type: "object",
        required: ["productName", "currentPrice"],
        properties: {
            productName: {
                type: "string",
                description: "The full product name or title",
            },
            currentPrice: {
                type: "string",
                description: "The current price as a number without currency symbol",
            },
            currencyCode: {
                type: "string",
                description: "The 3-letter currency code (e.g. USD, INR, EUR)",
            },
            productImageUrl: {
                type: "string",
                description: "The main product image URL",
            },
        },
    };

    try {
        const result = await firecrawl.scrapeUrl(url, {
            formats: ["extract"],
            extract: {
                schema: extractionSchema,
                prompt:
                    "Extract the product name as 'productName', current price as a number 'currentPrice', currency code as 'currencyCode', and product image URL as 'productImageUrl' from the given product page.",
            },
        });

        if (!result.success) {
            console.error("Firecrawl scrape failed:", result);
            throw new Error(
                result.error || "Firecrawl returned an unsuccessful response"
            );
        }

        const extractedData = result.extract;
        if (!extractedData || !extractedData.productName) {
            console.error("Extracted data is missing or incomplete:", extractedData);
            throw new Error("No data extracted from URL");
        }

        return extractedData;
    } catch (error) {
        console.error("Error scraping product:", error.message || error);
        throw new Error(`Failed to scrape product data: ${error.message}`);
    }
}
