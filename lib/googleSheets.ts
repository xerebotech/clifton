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
                } else if (['beds', 'baths', 'area', 'devprojects', 'devyears', 'pricenumeric',
                    'annualrent', 'servicecharges', 'appreciation', 'unitsleft',
                    'occupancy', 'avgdaystorent', 'viewedtoday', 'bookedthisweek'].includes(header)) {
                    entry[header === 'devprojects' ? 'devProjects' :
                        header === 'devyears' ? 'devYears' :
                            header === 'pricenumeric' ? 'priceNumeric' :
                                header === 'annualrent' ? 'annualRent' :
                                    header === 'servicecharges' ? 'serviceCharges' :
                                        header === 'unitsleft' ? 'unitsLeft' :
                                            header === 'avgdaystorent' ? 'avgDaysToRent' :
                                                header === 'viewedtoday' ? 'viewedToday' :
                                                    header === 'bookedthisweek' ? 'bookedThisWeek' :
                                                        header] = Number(val.replace(/[^0-9.]/g, '')) || 0;
                } else if (header === 'goldenvisa') {
                    entry['goldenVisa'] = val.toLowerCase() === 'true' || val.toLowerCase() === 'yes' || val === '1';
                } else if (header === 'areagrowth') {
                    // Semicolon-separated numbers: "6.1;9.3;14.5;18.2;11.8"
                    entry['areaGrowth'] = val ? val.split(';').map(s => parseFloat(s.trim()) || 0) : [];
                } else if (header === 'commutes') {
                    // Format: "icon|name|dist|time;icon|name|dist|time"
                    entry[header] = val ? val.split(';').map(s => {
                        const parts = s.trim().split('|');
                        return { icon: parts[0] || '', name: parts[1] || '', dist: parts[2] || '', time: parts[3] || '' };
                    }) : [];
                } else if (header === 'nearbyamenities') {
                    // Format: "icon|name|dist;icon|name|dist"
                    entry['nearbyAmenities'] = val ? val.split(';').map(s => {
                        const parts = s.trim().split('|');
                        return { icon: parts[0] || '', name: parts[1] || '', dist: parts[2] || '' };
                    }) : [];
                } else if (header === 'amenitiestext') {
                    entry['amenitiesText'] = val;
                } else if (header === 'devdelivered') {
                    entry['devDelivered'] = val;
                } else if (header === 'devrating') {
                    entry['devRating'] = val;
                } else if (header === 'popgrowth') {
                    entry['popGrowth'] = val;
                } else {
                    entry[header] = val;
                }
            });


            return entry as Property;
        });

    return properties;
}
