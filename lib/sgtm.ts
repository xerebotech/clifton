import StapeSGTM from 'stape-sgtm-nodejs';

const stapeDomain = process.env.NEXT_PUBLIC_STAPE_DOMAIN || 'gtm.example.com';

const sgtm = new StapeSGTM({
    gtm_server_domain: `https://${stapeDomain}`,
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
