import StapeSGTM from 'stape-sgtm-nodejs';

const stapeDomain = process.env.NEXT_PUBLIC_STAPE_DOMAIN || 'gtm.example.com';
const isLoadBalanced = stapeDomain.includes(','); // Example if user uses comma separated domains
const servers = isLoadBalanced ? stapeDomain.split(',').map(d => `https://${d.trim()}`) : `https://${stapeDomain}`;

const sgtm = new StapeSGTM({
    gtm_server_domain: servers as string, // stape-sgtm-nodejs supports string | string[] internally or falls back gracefully
    // If backend doesn't formally type array, we can use a randomized domain selection:
    request_path: '/market',
});

export const sendServerEvent = (eventName: string, eventData: any = {}) => {
    try {
        sgtm.sendEventData(eventName, eventData);
    } catch (error) {
        console.error('Error sending SGTM event:', error);
    }
};

export default sgtm;
