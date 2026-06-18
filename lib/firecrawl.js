import { Firecrawl } from 'firecrawl';

const firecrawl = new Firecrawl({
  
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export async function scrapeProduct(url) {
    try{
        const result = await firecrawl.scrape(url, {
            formats: [{type: 'json' ,"schema": {
                "type": "object",
                "required": ["productName", "currentPrice"],
                "properties": {
                    "productName": {
                        "type": "string"
                    },
                    "currentPrice": {
                        "type": "string"
                    },
                    "currencyCode": {
                        "type": "string"
                    },
                    "productImageUrl": {
                        "type": "string"
                    },
                },
            },
            "prompt": "Extract the product name  as 'productName', current price as a number 'currentPrice}', currency code as 'currencyCode', and product image URL as 'productImageUrl' from the given product page. Return the data in JSON format.",
        
        }
    ]
    });
    } catch(error){

    }
}