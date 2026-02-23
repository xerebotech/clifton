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
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
}

export async function submitInquiry(data: InquiryData): Promise<boolean> {

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
                utm_source: data.utm_source || "",
                utm_medium: data.utm_medium || "",
                utm_campaign: data.utm_campaign || "",
                utm_term: data.utm_term || "",
                utm_content: data.utm_content || "",
                timestamp: new Date().toISOString()
            })
        });

        return true;
    } catch (error) {
        console.error("Error submitting inquiry:", error);
        return false;
    }
}
