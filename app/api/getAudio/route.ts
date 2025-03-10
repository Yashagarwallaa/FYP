import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url');
    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        const filePath = path.join(process.cwd(), 'public', 'downloads', 'downloaded_audio.mp3');
        fs.writeFileSync(filePath, response.data);

        return NextResponse.json({ success: true, filePath });
    } catch (error) {
        console.error('Error downloading MP3:', error);
        return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
    }
}
