import { Property } from './propertiesData';

/**
 * Utility to fetch and parse Google Sheets CSV data
 * Ensure your Google Sheet is "Published to the Web" as a CSV.
 */

// Example CSV URL format: 
// https://docs.google.com/spreadsheets/d/e/2PACX-1vQ.../pub?output=csv
const GOOGLE_SHEET_CSV_URL = process.env.NEXT_PUBLIC_PROPERTIES_SHEET_URL || "";

export async function fetchPropertiesFromSheet(): Promise<Property[]> {
    if (!GOOGLE_SHEET_CSV_URL) {
        console.warn("Google Sheet URL is not defined. Falling back to static data.");
        const { properties } = await import('./propertiesData');
        return properties;
    }

    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL, {
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (!response.ok) throw new Error("Failed to fetch Google Sheet");

        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error("Error fetching properties from sheet:", error);
        const { properties } = await import('./propertiesData');
        return properties;
    }
}

/**
 * Converts a Google Drive share link into a direct download/view link
 */
function convertGoogleDriveUrl(url: string | undefined): string {
    if (!url) return "";
    const trimmed = url.trim();
    if (!trimmed.includes('drive.google.com')) return trimmed;

    // Extract ID from different Google Drive URL formats
    const match = trimmed.match(/\/d\/(.+?)\/([a-z]+|$)/) || trimmed.match(/id=(.+?)(&|$)/);
    const fileId = match ? match[1] : null;

    if (fileId) {
        // Falling back to a standard direct download link which sometimes has better limits than the thumbnail service
        return `https://docs.google.com/uc?id=${fileId}&export=download`;
    }

    return trimmed;
}

function parseCSV(csvText: string): Property[] {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let inQuotes = false;

    // Robust CSV parsing to handle commas inside quotes
    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];

        if (inQuotes) {
            if (char === '"' && nextChar === '"') {
                currentCell += '"';
                i++;
            } else if (char === '"') {
                inQuotes = false;
            } else {
                currentCell += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                currentRow.push(currentCell.trim());
                currentCell = '';
            } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
                currentRow.push(currentCell.trim());
                rows.push(currentRow);
                currentRow = [];
                currentCell = '';
                if (char === '\r') i++;
            } else {
                currentCell += char;
            }
        }
    }
    if (currentCell !== '' || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
    }

    if (rows.length < 2) return [];

    const headers = rows[0].map(h => h.trim().toLowerCase());
    console.log("CSV Headers found:", headers);

    const properties = rows.slice(1)
        .filter(row => row.some(cell => cell.trim() !== ""))
        .map((row, rowIndex) => {
            const entry: any = {};
            headers.forEach((header, index) => {
                const rawVal = row[index] || "";
                const val = rawVal.trim();

                if (header === 'amenities') {
                    entry[header] = val ? val.split(';').map(s => s.trim()) : [];
                } else if (header === 'gallery') {
                    entry[header] = val ? val.split(';').map(s => convertGoogleDriveUrl(s.trim())) : [];
                } else if (header === 'image') {
                    entry[header] = convertGoogleDriveUrl(val);
                } else if (header === 'beds' || header === 'baths' || header === 'area') {
                    // Remove non-numeric chars but keep decimal points
                    entry[header] = Number(val.replace(/[^0-9.]/g, '')) || 0;
                } else {
                    entry[header] = val;
                }
            });

            // Debug first property to check alignment
            if (rowIndex === 0) {
                console.log("--- DEBUG: First Row Mapping ---");
                headers.forEach((h, i) => console.log(`[${i}] ${h}: ${row[i]}`));
                console.log("--------------------------------");
            }

            return entry as Property;
        });

    console.log(`Parsed ${properties.length} properties from Google Sheet.`);
    return properties;
}
