import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import input from 'input';

let client: TelegramClient | null = null;

export async function getTelegramClient() {
    if (!process.env.TELEGRAM_API_ID) throw new Error('TELEGRAM_API_ID is required');
    if (!process.env.TELEGRAM_API_HASH) throw new Error('TELEGRAM_API_HASH is required');
    if (!process.env.TELEGRAM_PHONE_NUMBER) throw new Error('TELEGRAM_PHONE_NUMBER is required');

    const apiId = parseInt(process.env.TELEGRAM_API_ID);
    const apiHash = process.env.TELEGRAM_API_HASH;
    const phoneNumber = process.env.TELEGRAM_PHONE_NUMBER;

    // Return existing connected client
    if (client?.connected) return client;

    // Create new client
    const stringSession = new StringSession(process.env.TELEGRAM_SESSION || '');
    client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
        useWSS: true,
        baseLogger: console
    });

    // Connect and authenticate if needed
    if (!client.connected) {
        try {
            await client.connect();
            
            if (!client.connected) {
                await client.start({
                    phoneNumber: async () => phoneNumber,
                    password: async () => await input.text('Please enter your 2FA password (if enabled): '),
                    phoneCode: async () => await input.text('Please enter the code you received: '),
                    onError: (err) => console.error('Client Error:', err),
                });

                console.log('Client connected and authenticated');
                
                // Save the session string
                const sessionString = client.session.save();
                console.log('Save this session string in your .env.local file as TELEGRAM_SESSION:', sessionString);
            }
        } catch (error) {
            console.error('Failed to connect to Telegram:', error);
            throw error;
        }
    }

    return client;
}
