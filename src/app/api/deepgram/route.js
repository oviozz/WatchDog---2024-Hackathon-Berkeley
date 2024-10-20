
import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.DEEPGRAM_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'Deepgram API key not found' }, { status: 500 });
    }

    return NextResponse.json({ key: apiKey });
}