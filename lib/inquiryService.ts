/**
 * Service to handle inquiry submissions to Google Sheets
 */

const INQUIRY_SCRIPT_URL = process.env.NEXT_PUBLIC_INQUIRY_SCRIPT_URL || "";

export interface InquiryData {
    name: string;
    email: string;
    phone: string;
    projectOrService: string;
    message: string;
}

export async function submitInquiry(data: InquiryData): Promise<boolean> {
    if (!INQUIRY_SCRIPT_URL) {
        console.warn("Inquiry script URL is not defined. Submission skipped.");
        // Simulate success in development if URL is missing
        return true;
    }

    try {
        const response = await fetch(INQUIRY_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Apps Script requires no-cors if not handling OPTIONS
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                timestamp: new Date().toISOString()
            })
        });

        // With no-cors, we can't see the response status, but if it doesn't throw, it likely sent.
        return true;
    } catch (error) {
        console.error("Error submitting inquiry:", error);
        return false;
    }
}
