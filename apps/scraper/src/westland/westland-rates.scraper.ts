import axios from 'axios';
import * as cheerio from 'cheerio';
import { addProperty, addRateHistory } from '@db';

export const scrapeWestlandRates = async () => {
  try {
    const res = await axios.get('https://magiq.westlanddc.govt.nz/rates/properties/2574051507');
    console.log("html responce", res)

    const $ = cheerio.load(res.data);

    // Extract main property data
    const valuationNumber = $('div:contains("Valuation No.")').next().text().trim();
    const location = $('div:contains("Location")').next().text().trim();
    const legalDescription = $('div:contains("Legal Description")').next().text().trim();
    const propertyArea = $('div:contains("Property Area")').next().text().trim();

    console.log(`📌 Property: ${valuationNumber}, Location: ${location}, Area: ${propertyArea} ha`);

    // Add property to DB
    addProperty(valuationNumber, location, legalDescription, propertyArea);

    // Find the history table and loop rows
    $('h3:contains("History")')
      .parent().nextAll('div')
      .find('table tbody tr')
      .each((_, row) => {
        const cols = $(row).find('td');
        const year = $(cols[0]).text().trim(); // e.g. "2024/2025"
        const landValue = parseFloat($(cols[1]).text().replace(/[^0-9.]/g, '')) || 0;
        const capitalValue = parseFloat($(cols[2]).text().replace(/[^0-9.]/g, '')) || 0;
        const annualRates = parseFloat($(cols[3]).text().replace(/[^0-9.]/g, '')) || 0;

        console.log(`📦 ${year}: Land $${landValue}, Capital $${capitalValue}, Rates $${annualRates}`);

        // Add history row into DB
        addRateHistory(valuationNumber, year, landValue, capitalValue, annualRates);
      });

    console.log('✅ Done scraping all history years!');
  } catch (err) {
    console.error('❌ Scraper error:', err);
  }
}


