const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const readline = require('readline');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Promisify readline question
const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, (answer: string) => {
            resolve(answer);
        });
    });
};

async function main(): Promise<void> {
    if (!process.env.TELEGRAM_API_ID) throw new Error('TELEGRAM_API_ID is required');
    if (!process.env.TELEGRAM_API_HASH) throw new Error('TELEGRAM_API_HASH is required');
    if (!process.env.TELEGRAM_PHONE_NUMBER) throw new Error('TELEGRAM_PHONE_NUMBER is required');

    const apiId = parseInt(process.env.TELEGRAM_API_ID);
    const apiHash = process.env.TELEGRAM_API_HASH;
    const phoneNumber = process.env.TELEGRAM_PHONE_NUMBER;

    console.log('Creating new Telegram client...');
    const stringSession = new StringSession(''); // Empty string = no session
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
        useWSS: true,
    });

    try {
        // Connect to Telegram
        await client.connect();
        console.log('Connected to Telegram!');

        // Start the authorization process
        console.log('Starting authorization...');
        await client.start({
            phoneNumber: async () => phoneNumber,
            password: async () => await question('Please enter your 2FA password (if enabled): '),
            phoneCode: async () => await question('Please enter the code you received: '),
            onError: (err: Error) => console.error('Authorization Error:', err),
        });

        console.log('Successfully authorized!');
        
        // Save the session string
        const sessionString = client.session.save();
        console.log('\n=== SAVE THIS STRING IN YOUR .env.local FILE AS TELEGRAM_SESSION ===\n');
        console.log(sessionString);
        console.log('\n========================================================\n');
        
    } catch (error) {
        console.error('Failed to connect or authorize:', error);
        throw error;
    } finally {
        await client.disconnect();
        rl.close();
    }
}

main().catch((error: Error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
