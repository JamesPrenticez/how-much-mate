import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

// Ensure the directory exists
const dbPath = 'data/westland-rates.sqlite';
mkdirSync(dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    valuation_number TEXT UNIQUE,
    location TEXT,
    legal_description TEXT,
    property_area REAL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS rates_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER,
    year TEXT,
    land_value REAL,
    capital_value REAL,
    annual_rates REAL,
    FOREIGN KEY (property_id) REFERENCES properties(id)
  );
`);

export function addProperty(
  valuationNumber: string,
  location: string,
  legalDescription: string,
  propertyArea: number | string
): void {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO properties (valuation_number, location, legal_description, property_area)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(
    valuationNumber,
    location,
    legalDescription,
    typeof propertyArea === 'number' ? propertyArea : parseFloat(propertyArea) || 0
  );
}

export function addRateHistory(
  valuationNumber: string,
  year: string,
  landValue: number,
  capitalValue: number,
  annualRates: number
): void {
  const getProperty = db.prepare('SELECT id FROM properties WHERE valuation_number = ?');
  const row = getProperty.get(valuationNumber) as { id: number } | undefined;
  
  if (row) {
    db.prepare(`
      INSERT INTO rates_history (property_id, year, land_value, capital_value, annual_rates)
      VALUES (?, ?, ?, ?, ?)
    `).run(row.id, year, landValue, capitalValue, annualRates);
  } else {
    console.warn(`Property ${valuationNumber} not found!`);
  }
}