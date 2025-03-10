import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const filePath = path.join(process.cwd(), 'public', 'downloads', 'downloaded_audio.mp3');

        if (!fs.existsSync(filePath)) {
            console.error('❌ File not found at:', filePath);
            return NextResponse.json({ error: 'Audio file not found' }, { status: 404 });
        }

        const data = new FormData();
        data.append('file', fs.createReadStream(filePath));
        data.append('model', 'whisper-1');

        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', data, {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                ...data.getHeaders(),
            },
        });

        console.log('✅ Whisper API response:', response.data);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Error deleting file: ${err.message}`);
            } else {
                console.log(`File deleted successfully: ${filePath}`);
            }
        });
        return NextResponse.json({ transcript: response.data.text });

    } catch (error: any) {
        console.error('❌ Error generating transcript:', error.response?.data || error.message);
        return NextResponse.json({
            error: error.response?.data?.error?.message || 'Failed to generate transcript'
        }, { status: 500 });
    }
}
