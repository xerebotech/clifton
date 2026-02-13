/**
 * Service to handle inquiry submissions to Google Sheets
 */

const INQUIRY_SCRIPT_URL = process.env.NEXT_PUBLIC_INQUIRY_SCRIPT_URL || "";

export interface InquiryData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    projectOrService: string;
    message: string;
}

export async function submitInquiry(data: InquiryData): Promise<boolean> {
    console.log("Attempting to submit inquiry to:", INQUIRY_SCRIPT_URL);

    if (!INQUIRY_SCRIPT_URL) {
        console.error("CRITICAL: Inquiry script URL is missing! Check your environment variables.");
        return false;
    }

    try {
        const response = await fetch(INQUIRY_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                projectOrService: data.projectOrService,
                message: data.message,
                timestamp: new Date().toISOString()
            })
        });

        console.log("Inquiry submission request sent successfully.");
        return true;
    } catch (error) {
        console.error("Error submitting inquiry:", error);
        return false;
    }
}
