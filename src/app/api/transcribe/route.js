
// pages/api/transcribe.js
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import { Server } from 'ws';

const deepgram = createClient(process.env.NEXT_DEEPGRAM_API_KEY);

const handler = (req, res) => {
    if (req.method === 'GET') {
        res.status(200).send('WebSocket server is running.');
    } else {
        res.status(405).end(); // Method Not Allowed
    }
};

// Create WebSocket server
const wss = new Server({ noServer: true });

wss.on('connection', (ws) => {
    const connection = deepgram.listen.live({
        model: 'nova-2',
        language: 'en-US',
        smart_format: false,
    });

    connection.on(LiveTranscriptionEvents.Open, () => {
        console.log('WebSocket connection opened.');
    });

    connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const transcript = data.channel.alternatives[0].transcript;
        ws.send(transcript);
    });

    connection.on(LiveTranscriptionEvents.Close, () => {
        console.log('WebSocket connection closed.');
    });

    connection.on(LiveTranscriptionEvents.Error, (err) => {
        console.error(err);
    });

    ws.on('message', (message) => {
        // Handle incoming audio data
        connection.send(message);
    });

    ws.on('close', () => {
        connection.close();
    });
});

// Add the WebSocket server to the Next.js API handler
export default (req, res) => {
    if (req.method === 'GET') {
        res.socket.server.on('upgrade', (request, socket, head) => {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });
        });
        return handler(req, res);
    }
    return handler(req, res);
};
